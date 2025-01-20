function Form() {
  return (
    <div>
      <form action='post'>
        <label htmlFor='email'>Email</label>
        <input type='text' name='email' placeholder='Email' />
        <label htmlFor='password'>Password</label>
        <input type='text' name='password' placeholder='Password' />
        <label htmlFor='confirmPassword'>Confirm Password</label>
        <input
          type='text'
          name='confirmPassword'
          placeholder='Confirm password'
        />
        <button>Next</button>
        <button>Login</button>
        <button>Register</button>
      </form>
    </div>
  );
}

export default Form;
