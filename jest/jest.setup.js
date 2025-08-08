import './directMocks/window.mock';

const suppressErrors = [
  { errorString: 'findDOMNode' }, // This should be REMOVED once findDOMNode is properly stamped out from all dependencies
  { errorString: 'Unknown event handler property `%s`' }, // These tend to come from stripes having "on..." props passed directly to html nodes. Might need to be reinstated
  { errorString: 'Failed %s type: %s%s', context: 'Invalid prop `icon` supplied to `Icon`, expected one of type [function].' }, // Specifically this proptype fails in jest as it usually uses clever webpack stuff
];

const originalError = console.error;
console.error = jest.spyOn(console, 'error').mockImplementation((message, ...rest) => {
  const contextArray = [...rest];
  if (suppressErrors.every(m => {
    return (
      message.includes instanceof Function &&
      (
        (!m.context && !message.includes(m.errorString)) || // If there is no context, and errorString matches, suppress
        (message.includes(m.errorString) && !contextArray.includes(m.context)) // If the errorString matches AND context includes, suppress
      )
    );
  })) {
    originalError.apply(console, [message, ...rest]);
  }
});
