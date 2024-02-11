import { FormikState } from "formik";
import { KontingenState } from "./kontingen/kontingenConstants";
import { OfficialState } from "./official/officialConstants";

// RESET FORM TYPE
export type ResetForm = (
  nextState?: Partial<FormikState<any>> | undefined
) => void;

// SET SUBMITTING TYPE
export type SetSubmitting = (isSubmitting: boolean) => void;

export type Confirm = (
  title: string,
  message: string,
  cancelLabel?: string | undefined
) => Promise<unknown>;
