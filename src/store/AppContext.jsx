import React, { createContext, useContext, useEffect, useReducer } from 'react';
import storage from '../services/storageService';
import billingService from '../services/billingService';
import masterData from '../utils/master-data.json';

const initialState = {
  master: null,
  loading: true,
  error: null,
};

const ACTIONS = {
  INIT: 'INIT',
  SET_ERROR: 'SET_ERROR',
  CREATE_BILL: 'CREATE_BILL',
  UPDATE_BILL: 'UPDATE_BILL',
  CLOSE_BILL: 'CLOSE_BILL',
  ADD_EMPLOYEE: 'ADD_EMPLOYEE',
  ADD_EXPENSE: 'ADD_EXPENSE',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return { ...state, master: action.payload, loading: false };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        let master = await storage.getMaster();
        
        // If no master data found, initialize with master-data.json
        if (!master || Object.keys(master).length === 0) {
          console.log('No master data found, initializing with master-data.json');
          master = masterData;
          await storage.saveMaster(master);
          console.log('Master data initialized successfully');
        }
        
        if (mounted) dispatch({ type: ACTIONS.INIT, payload: master });
      } catch (err) {
        console.error('Error loading master data:', err);
        dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      }
    })();
    return () => (mounted = false);
  }, []);

  // Actions
  const createBill = async (billData) => {
    try {
      const master = state.master || {};
      const bill = await billingService.createBill(master, billData);
      const updatedMaster = await storage.getMaster();
      dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
      return bill;
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  const updateBill = async (billId, patch) => {
    try {
      const master = state.master || {};
      const bill = await billingService.updateBill(master, billId, patch);
      const updatedMaster = await storage.getMaster();
      dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
      return bill;
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  const closeBill = async (billId, opts) => {
    try {
      const master = state.master || {};
      const bill = await billingService.closeBill(master, billId, opts);
      const updatedMaster = await storage.getMaster();
      dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
      return bill;
    } catch (err) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
      throw err;
    }
  };

  const addEmployee = async (employee) => {
    const master = state.master || {};
    master.employees = master.employees || [];
    master.employees.push({ ...employee, id: `emp_${Date.now()}` });
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  const updateEmployee = async (employeeId, patch) => {
    const master = state.master || {};
    master.employees = master.employees || [];
    const idx = master.employees.findIndex((e) => e.id === employeeId);
    if (idx === -1) throw new Error('Employee not found');
    master.employees[idx] = { ...master.employees[idx], ...patch };
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  const deleteEmployee = async (employeeId) => {
    const master = state.master || {};
    master.employees = master.employees || [];
    master.employees = master.employees.filter((e) => e.id !== employeeId);
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  const addExpense = async (expense) => {
    const master = state.master || {};
    master.expenses = master.expenses || [];
    master.expenses.push({ ...expense, id: `exp_${Date.now()}`, date: new Date().toISOString() });
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  const addDish = async (dish) => {
    const master = state.master || {};
    master.dishes = master.dishes || [];
    master.dishes.push({ ...dish, id: dish.id || `dish_${Date.now()}` });
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  const updateDish = async (dishId, patch) => {
    const master = state.master || {};
    master.dishes = master.dishes || [];
    const idx = master.dishes.findIndex((d) => d.id === dishId);
    if (idx === -1) throw new Error('Dish not found');
    master.dishes[idx] = { ...master.dishes[idx], ...patch };
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  const deleteDish = async (dishId) => {
    const master = state.master || {};
    master.dishes = master.dishes || [];
    master.dishes = master.dishes.filter((d) => d.id !== dishId);
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  const deleteBill = async (billId) => {
    const master = state.master || {};
    master.bills = master.bills || [];
    master.bills = master.bills.filter((b) => b.id !== billId);
    await storage.saveMaster(master);
    const updatedMaster = await storage.getMaster();
    dispatch({ type: ACTIONS.INIT, payload: updatedMaster });
  };

  return (
    <AppContext.Provider value={{ state, createBill, updateBill, closeBill, addEmployee, updateEmployee, deleteEmployee, addExpense, addDish, updateDish, deleteDish, deleteBill }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
