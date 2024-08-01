import React from 'react';

const NavSideRaspored = ({ students, onStudentClick, onCombinedScheduleClick }) => {
  return (
    <>
      <div className="raspored-lista">
        {students.length === 0 ? (
          <div className="rl-items">
            <div className="rl">Nema dodanih učenika</div>
          </div>
        ) : (
          <div className="rl-items">
            <div className="rl moj-raspored" onClick={onCombinedScheduleClick}>
              Moj raspored
            </div>
            {students.map((student) => (
              <div
                className="rl"
                key={student._id}
                onClick={() => onStudentClick(student._id)}
              >
                {student.ime} {student.prezime}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NavSideRaspored;
