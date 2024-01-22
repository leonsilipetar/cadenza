import '../../App.css';

const NavSideRaspored = ({students}) => {
  return (
    <>
      <div className="raspored-lista">
        {/*POPIS rasporeda učenika */}
        {students.length === 0 ? (
            <div className="rl-items">
          <div className="rl">Nema dodanih učenika</div>
          </div>
        ) : (
          <div className="rl-items">
            {students.map((student) => (
              <div className="rl" key={student._id}>
                {student.ime} {student.prezime}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default NavSideRaspored;
