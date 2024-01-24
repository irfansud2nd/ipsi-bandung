"use client";
import {
  decrement,
  incrementByAmount,
} from "@/utils/redux/counter/counterSlice";
import { RootState } from "@/utils/redux/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const CounterButtons = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
  return (
    <div className="flex gap-1">
      <button
        className="btn_green"
        onClick={() => dispatch(incrementByAmount(9))}
      >
        +
      </button>
      <h1>{count}</h1>
      <button className="btn_red" onClick={() => dispatch(decrement())}>
        -
      </button>
    </div>
  );
};

export default CounterButtons;
