import { PropertyPaneSlider } from "@microsoft/sp-property-pane";
import {
  ActionButton,
  DefaultButton,
  mergeStyles,
  Panel,
  PrimaryButton,
  Stack,
  TextField,
} from "office-ui-fabric-react";
import * as React from "react";
import { useState } from "react";
import { IFormModel } from "./IFormModel";
import { ISimpleAddEditFormProps } from "./ISimpleAddEditFormProps";
// import { SubmitHandler, useForm } from "react-hook-form";

// type Inputs = {
//   Title: string;
//   Description: string;
// };
 function SimpleAddEditForm(props: ISimpleAddEditFormProps) {
  //   const { register, handleSubmit, watch, errors } = useForm<Inputs>();
  //   console.log(watch());
  //   const onSubmit: SubmitHandler<Inputs> = (data) => {
  //     console.log(data);
  //   };

  let [isOpen, setIsOpen] = useState(false);

  //isOpen -> Objeto
  //setIsOpen -> função anonima que deverá configurar o valor do objeto.

  let _formData: IFormModel = {
    title: "",
    lastName: "",
    emailAddress: "",
    password: "",
  };
  let [formData, setFormData] = useState(_formData);

  let _container = mergeStyles({});

  let _btnCont = mergeStyles({ paddingTop: 20 });

  function _onSubmitForm(): void {
    setIsOpen(false);
    props.handleSubmit(formData);
    console.log('Form Fields values', JSON.stringify(formData));
  }
  

  return (
    <div className={_container}>
      <ActionButton
        iconProps={{ iconName: "Add" }}
        text={props.buttonTitle}
        onClick={() => setIsOpen(true)}
      />
      <Panel
        isOpen={isOpen}
        headerText="Add a new Item"
        onDismiss={() => setIsOpen(false)}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="First Name"
            onChange={(e) =>
              setFormData({
                ...formData,
                title: (e.target as HTMLInputElement).value,
              })
            }
          ></TextField>
          <TextField
            label="Last Name"
            onChange={(e) =>
              setFormData({
                ...formData,
                lastName: (e.target as HTMLInputElement).value,
              })
            }
          ></TextField>
          <TextField
            label="Email"
            onChange={(e) =>
              setFormData({
                ...formData,
                emailAddress: (e.target as HTMLInputElement).value,
              })
            }
          ></TextField>
          <TextField
            label="Password"
            type="password"
            onChange={(e) =>
              setFormData({
                ...formData,
                password: (e.target as HTMLInputElement).value,
              })
            }
          ></TextField>
        </Stack>
        <Stack
          className={_btnCont}
          horizontal
          horizontalAlign="end"
          tokens={{ childrenGap: 10 }}
        >
          <PrimaryButton text="Add New Item" onClick={()=> _onSubmitForm()} />
          <DefaultButton text="Cancel" onClick={() => setIsOpen(false)} />
        </Stack>
      </Panel>
      {/* <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label htmlFor="Title" className="form-label">
            First name
          </label>
          <input
            ref={register({ required: true, maxLength: 20 })}
            name="Title"
            type="text"
            className="form-control"
            id="Title"
          ></input>
        </div>
        <div className="mb-3">
          <label htmlFor="LastName" className="form-label">
            Last name
          </label>
          <input
            ref={register({ required: true, maxLength: 50 })}
            name="LastName"
            type="text"
            className="form-control"
            id="LastName"
          ></input>
        </div>
        <div className="mb-3">
          <label htmlFor="EmailAddress" className="form-label">
            Email address
          </label>
          <input
            ref={register}
            name="EmailAddress"
            type="text"
            className="form-control"
            id="EmailAddress"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Password" className="form-label">
            Password
          </label>
          <input
            ref={register({ required: true })}
            name="Password"
            type="password"
            className="form-control"
            id="Password"
          ></input>
        </div>
        <div className="mb-3 form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          ></input>
          <label className="form-check-label">Check me out</label>
        </div>
        {errors.Description && <span>This field is required</span>}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form> */}
    </div>
  );
}

export default SimpleAddEditForm;


