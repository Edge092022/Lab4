import { Fragment } from 'react';
import { PERSON_FIELDS } from '../data/people.js';

// Fallback cho <Suspense>. Cùng khung (section.person-card > dl.person-detail, cùng số dòng)
// với PersonDetail → khi chunk tải xong, nội dung thay chỗ mà không xô layout (CLS = 0).
// KHÔNG import PersonDetail ở đây: làm vậy sẽ kéo nó vào bundle chính, mất code-splitting.
export default function Skeleton() {
  return (
    <section
      className="person-card"
      aria-busy="true"
      aria-live="polite"
      aria-label="Đang tải thông tin"
    >
      <dl className="person-detail">
        {PERSON_FIELDS.map(({ key, label }) => (
          <Fragment key={key}>
            <dt>{label}</dt>
            <dd>
              <span className="skeleton-bar" />
            </dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
