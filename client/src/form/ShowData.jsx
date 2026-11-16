import { Fragment, useId } from 'react';

// Inspector chỉ đọc: hiển thị key–value bằng <dl>/<dt>/<dd> (rules §4 a11y).
export default function ShowData({ data }) {
  const headingId = useId();

  return (
    <section className="inspector" aria-labelledby={headingId}>
      <h2 id={headingId}>Dữ liệu đã gửi</h2>
      <dl className="json-inspector">
        {Object.entries(data).map(([key, value]) => (
          // key của object là duy nhất và ổn định → dùng làm React key (không dùng index)
          <Fragment key={key}>
            <dt>{key}</dt>
            <dd>{String(value)}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
