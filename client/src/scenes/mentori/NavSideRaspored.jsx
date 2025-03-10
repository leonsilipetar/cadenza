import React from 'react';

const NavSideRaspored = ({ students, onStudentClick, onCombinedScheduleClick, biljeske }) => {
  console.log("students from NavRaspored: ", students)
  return (
    <div className="raspored-lista">
      {students?.length === 0 ? (
        <div className="rl-items">
          <div className="rl">Nema dodanih učenika</div>
        </div>
      ) : (
        <div className="rl-items">
          <div className="rl moj-raspored" onClick={onCombinedScheduleClick}>
           {biljeske ? "Bilješke" : "Moj raspored"}
          </div>
          {students?.map((student) => (
            <div
              className="rl"
              key={student.ucenikId}
              onClick={() => onStudentClick(student.ucenikId)}
            >
              {student.ime} {student.prezime}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavSideRaspored;