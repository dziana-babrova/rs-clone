export enum FormInputsKeys {
  Email = 'email',
  Username = 'username',
  Password = 'password',
}

export enum FormType {
  SignIn = 'signIn',
  SignUp = 'signUp',
}

export type FormInput = {
  name: FormInputsKeys;
  type: string;
};

const FORM_INPUTS = [
  {
    name: FormInputsKeys.Email,
    type: 'email',
  },
  {
    name: FormInputsKeys.Username,
    type: 'text',
  },
  {
    name: FormInputsKeys.Password,
    type: 'password',
  },
];

export default FORM_INPUTS;
