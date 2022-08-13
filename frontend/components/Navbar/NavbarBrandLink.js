import { forwardRef } from 'react';
import { NavbarBrand } from 'reactstrap';

export default forwardRef(( props, ref ) => {
  let { children, ...newProps } = props;
  return (
    <NavbarBrand {...newProps}>
      {children}
    </NavbarBrand>
  )
})

