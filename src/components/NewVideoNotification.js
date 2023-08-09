import gql from 'graphql-tag';
import React from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';

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

const GENERATE_SUBJECT_LINES = gql`
  mutation GenerateSubjectLines($sessionId: ID!) {
    subjectLinesQueue(id: $sessionId, amount: 2)
  }
`;

export const GET_SESSION = gql`
  query GetSession($sessionId: ID!) {
    session(id: $sessionId) {
      id
      creativeDescription
      promptSubjectLines {
        content
      }
      subjectLines {
        id
        state
        revisions {
          id
          content
          tone
        }
      }
    }
  }
`;

const NewVideoNotification = () => {
  const [
    createSession,
    { data: sessionData, loading: sessionLoading, error: sessionError },
  ] = useMutation(CREATE_SESSION);

  const sessionId = React.useMemo(() => {
    return sessionData?.sessionCreate?.id ?? '';
  }, [sessionData]);

  const { loading, error, data } = useQuery(GET_SESSION, {
    variables: {
      sessionId,
    },
    skip: !sessionId,
  });

  const [generateSubjectLines] = useMutation(GENERATE_SUBJECT_LINES);

  const handleCreateSession = async () => {
    createSession({
      variables: {
        context: {
          accountId: 'wp72jxg0nx',
          creativeId: 'lm1n2vjz1g',
          promptSubjectLines: ['Test message 1'],
          imageUrl: 'test',
        },
      },
    });
  };

  const handleGenerateSubjectLines = async () => {
    generateSubjectLines({
      variables: {
        sessionId: sessionData.sessionCreate.id,
      },
    });
  };

  // const { data, error, loading } = useSubscription(SUBJECT_LINES_SUBSCRIPTION, {
  //   variables: {
  //     sessionId,
  //   },
  //   skip: !sessionId,
  // });

  console.log('data', data);
  console.log('error', error);
  console.log('loading', loading);
  console.log('-------------------');

  return (
    <div className="notification">
      <button onClick={handleCreateSession}>Create Session</button>
      <button onClick={handleGenerateSubjectLines}>
        Generate Subject Lines
      </button>
    </div>
  );
};

export default NewVideoNotification;
