import { Fragment, useId, useState } from 'react';
import { NavLink, useParams } from 'react-router';
import { useForumMessages } from './useForumMessages.js';
import { validateMessage } from '../form/validate.js';
import { navLinkClass } from '../navLinkClass.js';

export const FORUMS = ['nasa', 'esports-tribunal', 'notNasa'];

const formatTime = (iso) =>
  new Date(iso).toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' });

export default function ForumPage() {
  const { forumId } = useParams();
  const { data, loading, error, postMessage } = useForumMessages(forumId);
  const listHeadingId = useId();

  return (
    <div className="forum">
      <nav aria-label="Kênh" className="forum-channels">
        {FORUMS.map((forum) => (
          <NavLink key={forum} to={`/forum/${forum}`} className={navLinkClass}>
            {forum}
          </NavLink>
        ))}
      </nav>

      <section
        className="forum-messages"
        aria-labelledby={listHeadingId}
        aria-busy={loading}
        aria-live="polite"
      >
        <h2 id={listHeadingId}>Tin nhắn #{forumId}</h2>
        {error && <p role="alert" className="field-error">{error}</p>}
        {loading && <p>Đang tải…</p>}
        {!loading && !error && data.length === 0 && <p>Chưa có tin nhắn nào. Hãy gửi tin đầu tiên.</p>}
        {data.length > 0 && (
          <dl className="message-list">
            {data.map((msg) => (
              <Fragment key={msg.id}>
                <dt>
                  <strong>{msg.author}</strong>{' '}
                  <time dateTime={msg.timestamp}>{formatTime(msg.timestamp)}</time>
                </dt>
                <dd>{msg.text}</dd>
              </Fragment>
            ))}
          </dl>
        )}
      </section>

      {!error && <MessageForm onSend={postMessage} />}
    </div>
  );
}

function MessageForm({ onSend }) {
  const authorId = useId();
  const textId = useId();
  const [values, setValues] = useState({ author: '', text: '' });
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);

  // Derived — cùng luật với server (parity), tính trong render, không effect.
  const errors = submitAttempted ? validateMessage(values) : {};

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitAttempted(true);
    setSendError(null);
    if (Object.keys(validateMessage(values)).length > 0) return;

    setSending(true);
    try {
      await onSend(values);
      setValues((prev) => ({ ...prev, text: '' })); // giữ tên, xoá nội dung
      setSubmitAttempted(false);
    } catch (err) {
      setSendError(err.message); // lỗi server (vd 400) → hiện ra, không để promise reject trôi
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="simple-form" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor={authorId}>Tên</label>
        <input
          id={authorId}
          name="author"
          value={values.author}
          onChange={handleChange}
          aria-invalid={Boolean(errors.author)}
          aria-describedby={errors.author ? `${authorId}-error` : undefined}
        />
        {errors.author && <p id={`${authorId}-error`} role="alert" className="field-error">{errors.author}</p>}
      </div>
      <div className="field">
        <label htmlFor={textId}>Nội dung</label>
        <textarea
          id={textId}
          name="text"
          rows={3}
          value={values.text}
          onChange={handleChange}
          aria-invalid={Boolean(errors.text)}
          aria-describedby={errors.text ? `${textId}-error` : undefined}
        />
        {errors.text && <p id={`${textId}-error`} role="alert" className="field-error">{errors.text}</p>}
      </div>
      {sendError && <p role="alert" className="field-error">{sendError}</p>}
      <button type="submit" disabled={sending}>
        {sending ? 'Đang gửi…' : 'Gửi tin'}
      </button>
    </form>
  );
}
