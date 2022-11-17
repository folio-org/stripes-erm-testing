/* eslint-disable react/prop-types */
import { Form } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import setFieldData from 'final-form-set-field-data';

import { Button } from '@folio/stripes/components';

// Allow TestForm to work like a regular Form, and allow children rendering as function or node.
// Also include setFieldData mutator

const TestForm = ({
  children,
  mutators,
  ...formProps
}) => {
  /*
    This allows us to do things like:

    <TestForm>
      {({ form }) => (
        <FormComponent form={form} />
      )}
    </TestForm>

    For those instances where we would normally pass those values down from the form up above.
    Otherwise (such as in those cases where we grab those values from form context), we can render
    directly as children like we did before:

    <TestForm>
      <FormComponent />
    </TestForm>
   */

  const renderChildren = (props) => {
    if (typeof children === 'function') {
      return children({ ...props });
    }

    return children;
  };

  return (
    <Form
      mutators={{
        setFieldData,
        ...arrayMutators,
        ...mutators
      }}
      {...formProps}
    >
      {({ handleSubmit, ...otherFormProps }) => (
        <form onSubmit={handleSubmit}>
          {renderChildren(otherFormProps)}
          <Button data-testid="submit" id="submit" type="submit">
            Submit
          </Button>
        </form>
      )}
    </Form>
  );
};

export default TestForm;
