import { useState, useEffect } from 'react';
function App() {
  const [professionsObj, setProfessionsObj] = useState([]);
  const [activeProfession, setActiveProfession] = useState('');

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

  function handleClick(profession) {
    setActiveProfession(() => profession);
  }

  function ActiveInfo({ prof }) {
    const categoriesFlatten = prof.categories.map((cat) => cat.recipes).flat();
    console.log(categoriesFlatten);
    const recipesEl = categoriesFlatten.map((recipe) => (
      <li key={recipe.id}>{recipe.name}</li>
    ));
    return <div>{recipesEl}</div>;
  }

  function Profession({ profession, handleClick }) {
    return (
      <button
        className='p-6 bg-slate-300 h-20 hover:scale-110 w-60'
        onClick={() => handleClick(profession)}
      >
        {profession.name}
      </button>
    );
  }

  const professions = professionsObj.map((obj) => (
    <Profession profession={obj} handleClick={handleClick} key={obj.name} />
  ));

  return (
    <div>
      <div className='gap-4 flex'>{professions}</div>
      {activeProfession ? <ActiveInfo prof={activeProfession} /> : ''}
    </div>
  );
}

export default App;
