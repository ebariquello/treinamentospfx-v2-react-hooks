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
import { useEffect, useState } from "react";
import { ICustomListItem } from "../../../../models/ICustomListItem";
import { IFormModel } from "./IFormModel";
import { ISimpleAddEditFormProps } from "./ISimpleAddEditFormProps";

export const SimpleAddEditForm = (props: ISimpleAddEditFormProps) => {
  const [isOpen, setIsOpen] = useState(props.editModeForm);
 // const [isNewForm, setNewForm] = useState(false);
 const [fieldValues, setFieldValue] = useState({});
 

  //isOpen -> Objeto
  //setIsOpen -> função anonima que deverá configurar o valor do objeto.

  let _formData: ICustomListItem = {
    Title: "",
    LastName: "",
    EmailAddress: "",
    Password: "",
  };
  let [formData, setFormData] = useState(props.itemEdit!==undefined?props.itemEdit:_formData);

  useEffect(() => {
    // if (
    //   (isNewForm && props.editModeForm) ||
    //   (!isNewForm && props.editModeForm)
    // ) {
      setIsOpen(props.editModeForm);
      setFormData(props.itemEdit);

      //setNewForm(false);
    //}
  },[props.editModeForm]);

  let _container = mergeStyles({});

  let _btnCont = mergeStyles({ paddingTop: 20 });

  function _onSubmitForm(): void {
    setIsOpen(false);
    //setNewForm(false);
    props.handleSubmit(formData);
    console.log("Form Fields values", JSON.stringify(formData));
  }
  function _handleInputOnChange(event){
    //[event.target.name]: event.target.value
    //onLoadStart={(e)=> {e.currentTarget.value = props.itemEdit !==undefined? props.itemEdit.Password : formData.Password}}
    setFormData({
      ...formData,
      [event.target.name]: (event.target as HTMLInputElement).value,
    });
  }
  

  return (
    <div className={_container}>
      <ActionButton
        iconProps={{ iconName: "Add" }}
        text={props.buttonTitle}
        onClick={() => {
          setIsOpen(true);
          //setNewForm(true);
        }}
      />
      <Panel
        isOpen={isOpen}
        headerText={
          props.itemEdit == undefined
            ? "Add a new Item"
            : `Edit item :${props.itemEdit.ID}`
        }
        onDismiss={() => {
          setIsOpen(false);
          //setNewForm(false);
          props.handleCancel();
        }}
      >
        <Stack tokens={{ childrenGap: 15 }}>
          <TextField
            label="First Name"
            onChange={(e) => _handleInputOnChange(e) }
            name="Title"
            value={formData==undefined?"": formData.Title}
          
          ></TextField>
          <TextField
            label="Last Name"
            name="LastName"
            onChange={(e) => _handleInputOnChange(e) }
            value={formData==undefined?"": formData.LastName}
           
          ></TextField>
          <TextField
            label="Email"
            name="EmailAddress"
            onChange={(e) => _handleInputOnChange(e) }
            value={formData==undefined?"": formData.EmailAddress}
           
          ></TextField>
          <TextField
            label="Password"
            name="Password"
            type="password"
            onChange={(e) => _handleInputOnChange(e) }
            value={formData==undefined?"": formData.Password}
     
           
          ></TextField>
        </Stack>
        <Stack
          className={_btnCont}
          horizontal
          horizontalAlign="end"
          tokens={{ childrenGap: 10 }}
        >
          <PrimaryButton text={ props.itemEdit == undefined
            ? "Add new Item"
            : `Save item`} onClick={() => _onSubmitForm()} />
          <DefaultButton
            text="Cancel"
            onClick={() => {
              setIsOpen(false);
              //setNewForm(false);
              props.handleCancel();
            }}
          />
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
};

export default SimpleAddEditForm;
