import React from 'react';

export const Accordion = ({ titles, expandedStates, bodies, contents }) => {
  return (
    <div className="accordion" id="accordionExample">
      {titles.map((title, index) => (
        <div className="accordion-item" key={index}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${expandedStates[index] ? '' : 'collapsed'}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target={`#collapse${index}`}
              aria-expanded={expandedStates[index]}
              aria-controls={`collapse${index}`}
            >
              {title}
            </button>
          </h2>
          <div
            id={`collapse${index}`}
            className={`accordion-collapse collapse ${expandedStates[index] ? 'show' : ''}`}
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              <strong>{bodies[index]}</strong>
              {contents[index]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};


export const Testimonial = ({ name, role, comment, avatarSvg }) => (
  <div className="card testimonial-card">
    <div className="card-body">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width="64"
        height="64"
        className="testimonial-avatar"
      >
        {avatarSvg}
      </svg>
      <p className="card-text testimonial-comment">{comment}</p>
      <div className="testimonial-author">
        <h5 className="card-title">{name}</h5>
        <p className="card-subtitle mb-2 text-muted">{role}</p>
      </div>
    </div>
  </div>
);


