import { useState, useEffect } from 'react';
function App() {
  const [professionsObj, setProfessionsObj] = useState([]);
  const [activeProfession, setActiveProfession] = useState(null);
  function fetchData(id) {
    fetch(
      ` https://us.api.blizzard.com/data/wow/profession/${id}?namespace=static-us&locale=en_US&access_token=USLyXrvnS8AFGShg2vvtFcsfWR8bbSR05B`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.type.type === 'PRIMARY' && data.skill_tiers) {
          fetch(
            ` https://us.api.blizzard.com/data/wow/profession/${id}/skill-tier/${
              data.skill_tiers.at(-1).id
            }?namespace=static-us&locale=en_US&access_token=USLyXrvnS8AFGShg2vvtFcsfWR8bbSR05B`
          )
            .then((prof) => {
              return prof.json();
            })
            .then((profJson) => {
              setProfessionsObj((cur) => [...cur, profJson]);
            });
        }
      });
  }

  useEffect(() => {
    fetch(
      'https://us.api.blizzard.com/data/wow/profession/index?namespace=static-us&locale=en_US&access_token=USLyXrvnS8AFGShg2vvtFcsfWR8bbSR05B'
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const profIds = data.professions
          .filter(
            (profession) =>
              profession.name !== 'Skinning' &&
              profession.name !== 'Herbalism' &&
              profession.name !== 'Mining'
          )
          .map((profession) => profession.id);

        profIds.forEach((id) => fetchData(id));
      });
  }, []);

  console.log(professionsObj);

  function handleClick(profession) {
    setActiveProfession(profession);
  }

  function Profession({ profession, handleClick }) {
    return (
      <button
        className='p-6 bg-slate-300 hover:scale-110'
        onClick={handleClick(profession)}
      >
        {profession.name}
      </button>
    );
  }

  const professions = professionsObj.map((obj) => (
    <Profession profession={obj} handleClick={handleClick} key={obj.name} />
  ));

  return <div className='bg-sky-400 h-screen w-full'>{professions}</div>;
}

export default App;
