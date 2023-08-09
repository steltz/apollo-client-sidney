import gql from 'graphql-tag';
import React from 'react';
import { useMutation, useSubscription } from '@apollo/react-hooks';

const SUBSCRIBE_VIDEO_ADDED = gql`
  subscription onVideoAdded($title: String!) {
    videoAdded(title: $title) {
      id
      title
      url
    }
  }
`;

const CREATE_SESSION = gql`
  mutation CreateSession($context: ContextInput!) {
    sessionCreate(context: $context) {
      id
      creativeDescription
    }
  }
`;

const SUBJECT_LINES_SUBSCRIPTION = gql`
  subscription OnSubjectLine($sessionId: ID!) {
    subjectLines(id: $sessionId) {
      id
      state
      revisions {
        content
        tone
      }
    }
  }
`;

const NewVideoNotification = () => {
  const [subscriptionId, setSubscriptionId] = React.useState(null);
  const [
    createSession,
    { data: sessionData, loading: sessionLoading, error: sessionError },
  ] = useMutation(CREATE_SESSION);

  const handleCreateVideo = async () => {
    createSession({
      variables: {
        context: {
          accountId: 'wp72jxg0nx',
          creativeId: 'lm1n2vjz1g',
          promptSubjectLines: ['Test message 1'],
          imageUrl: 'test',
        },
      },
      onCompleted: (data) => {
        setSubscriptionId(data.sessionCreate.id);
      },
    });
  };

  const { data, error, loading } = useSubscription(SUBJECT_LINES_SUBSCRIPTION, {
    variables: {
      sessionId: '97b80a7e-7702-47f9-a297-f3370a38f333',
    },
  });

  // console.log(sessionData, sessionLoading, sessionError);
  console.log('data', data);
  console.log('error', error);
  console.log('loading', loading);
  console.log('-------------------');
  // const { data, error, loading } = useSubscription(SUBSCRIBE_VIDEO_ADDED, {
  //   variables: {
  //     title: 'My New Video',
  //   },
  // });

  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Error! {error.message}</div>;
  // }

  return (
    <div className="notification">
      <button onClick={handleCreateVideo}>Create Video</button>
    </div>
  );
};

export default NewVideoNotification;
