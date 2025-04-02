import './directMocks/window.mock';

const suppressErrors = [
  'findDOMNode', // This should be REMOVED once findDOMNode is properly stamped out from all dependencies
  'Unknown event handler property `%s`' // These tend to come from stripes having "on..." props passed directly to html nodes. Might need to be reinstated
];

const originalError = console.error;
console.error = jest.spyOn(console, 'error').mockImplementation((message, ...rest) => {
  if (suppressErrors.every(m => message.includes instanceof Function && !message.includes(m))) {
    originalError.apply(console, [message, ...rest]);
  }
});
