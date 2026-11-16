import { Fragment } from 'react';
import { useParams } from 'react-router';
import { people, PERSON_FIELDS } from '../data/people.js';
import NotFound from '../NotFound.jsx';

export default function PersonDetail() {
  const { id } = useParams();
  const person = people.find((p) => p.id === id);

  // 404 guard: id sai vẫn render trong PeopleLayout (sidebar còn nguyên).
  if (!person) {
    return <NotFound message={`Không tìm thấy người có id "${id}".`} />;
  }

  return (
    <section className="person-card" aria-label={person.name}>
      <dl className="person-detail">
        {PERSON_FIELDS.map(({ key, label }) => (
          <Fragment key={key}>
            <dt>{label}</dt>
            <dd>{person[key]}</dd>
          </Fragment>
        ))}
      </dl>
    </section>
  );
}
