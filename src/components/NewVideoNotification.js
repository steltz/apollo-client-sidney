import React from 'react';
import useSidney from './useSidney';

const Sandbox = () => {
  const { createSession, generateSubjectLines, session, getSession } =
    useSidney();
  console.log('Session', session);
  console.log('-------------------');
  return (
    <div className="notification">
      <button
        onClick={() =>
          createSession({
            accountId: 'wp72jxg0nx',
            creativeId: 'lm1n2vjz1g',
            promptSubjectLines: ['Test message 1'],
            imageUrl: 'test',
          })
        }
      >
        Create Session
      </button>
      <button onClick={() => generateSubjectLines()}>
        Generate Subject Lines
      </button>
      <button onClick={() => getSession()}>Get Session</button>
      {/* <div>AI Generated SLs from GetSession:</div>
      <ul>
        {data?.session?.subjectLines?.map((sl) => (
          <li key={sl.id}>{sl?.revisions[0].content}</li>
        ))}
      </ul>
      _____________________________
      <div>AI Generated SLs from OnSubjectLine Subscription:</div>
      <p>
        {subscriptionData?.subjectLines?.revisions[0].content} +{' '}
        {subscriptionData?.subjectLines?.revisions[0].tone}{' '}
      </p> */}
    </div>
  );
};

export default Sandbox;
