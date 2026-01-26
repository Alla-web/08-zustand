import { useId } from "react";
import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";

interface NoteFormProps {
  onCancelClick: () => void;
  onFormClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: "" | "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const INITIAL_VALUES: NoteFormValues = {
  title: "",
  content: "",
  tag: "",
};

const NoteFormSchema = Yup.object({
  title: Yup.string()
    .min(3, "Field title must consist at least 3 characters")
    .max(50, "Field title shoul be 50 characters maximum")
    .required("Field title is required"),
  content: Yup.string().max(500, "Field name shoul be 500 characters maximum"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Field tag is required"),
});

export default function NoteForm({
  onCancelClick,
  onFormClose: onNoteCreate,
}: NoteFormProps) {
  const fieldId = useId();
  const queryClient = useQueryClient();

  const createNoteM = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      console.log(note);
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
      onNoteCreate();
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Unknown error!");
      }
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    formikHelpers: FormikHelpers<NoteFormValues>
  ) => {
    createNoteM.mutate(values);
    formikHelpers.resetForm();
  };

  return (
    <Formik
      initialValues={INITIAL_VALUES}
      validationSchema={NoteFormSchema}
      onSubmit={handleSubmit}
    >
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-title`}>Title</label>
          <Field
            id={`${fieldId}-title`}
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${fieldId}-content`}
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage name="content" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor={`${fieldId}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${fieldId}-tag`}
            name="tag"
            className={css.select}
          >
            <option value=""> -- Select tag -- </option>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage name="tag" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button
            onClick={() => {
              onCancelClick();
            }}
            type="button"
            className={css.cancelButton}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            //   disabled=false
          >
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
