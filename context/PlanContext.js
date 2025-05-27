import React, { createContext, useState, useContext } from 'react';

const PlanContext = createContext();

export const usePlan = () => useContext(PlanContext);

export const PlanProvider = ({ children }) => {
  const [planMedicines, setPlanMedicines] = useState([
    
  ]);

  
  const addPlanMedicine = (medicineObj) => {
    const newId = (Date.now() + Math.random()).toString();
    setPlanMedicines((prev) => [
      { ...medicineObj, id: newId },
      ...prev,
    ]);
  };


  const deletePlanMedicine = (id) => {
    setPlanMedicines((prev) => prev.filter((med) => med.id !== id));
  };

  return (
    <PlanContext.Provider value={{ planMedicines, addPlanMedicine, deletePlanMedicine }}>
      {children}
    </PlanContext.Provider>
  );
};