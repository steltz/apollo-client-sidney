import React, { useMemo } from 'react';
import gql from 'graphql-tag';
import {
  useQuery,
  useMutation,
  useApolloClient,
  useLazyQuery,
} from '@apollo/react-hooks';

const CREATE_SESSION = gql`
  mutation CreateSession($context: ContextInput!) {
    sessionCreate(context: $context) {
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

const SUBJECT_LINES_SUBSCRIPTION = gql`
  subscription OnSubjectLine($sessionId: ID!) {
    subjectLines(id: $sessionId) {
      id
      state
      revisions {
        id
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

const GET_SESSION = gql`
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

const useSidney = () => {
  const _client = useApolloClient();

  const [_createSession, { data: sessionFromCreateSession }] = useMutation(
    CREATE_SESSION,
    {
      update(cache, { data: { sessionCreate: session } }) {
        cache.writeQuery({
          query: GET_SESSION,
          data: {
            session,
          },
          overwrite: true,
        });
      },
    },
  );

  const sessionId = useMemo(
    () => sessionFromCreateSession?.sessionCreate?.id,
    [sessionFromCreateSession],
  );

  const {
    data: session,
    startPolling: startSessionPolling,
    stopPolling: stopSessionPolling,
    subscribeToMore,
  } = useQuery(GET_SESSION, {
    variables: {
      sessionId,
    },
    skip: !sessionId,
  });

  const [getSession] = useLazyQuery(GET_SESSION, {
    variables: { sessionId },
  });

  React.useEffect(() => console.log(sessionId), [sessionId]);

  const [_generateSubjectLines] = useMutation(GENERATE_SUBJECT_LINES);

  const createSession = React.useCallback(
    (context) => {
      _createSession({
        variables: {
          context,
        },
      });
    },
    [_createSession],
  );

  const generateSubjectLines = React.useCallback(() => {
    _generateSubjectLines({
      variables: {
        sessionId,
      },
    });
  }, [_generateSubjectLines, sessionId]);

  React.useEffect(() => {
    if (!sessionId) return;
    const unsubscribe = subscribeToMore({
      document: SUBJECT_LINES_SUBSCRIPTION,
      variables: {
        sessionId,
      },
      updateQuery: (previousQueryResult, { subscriptionData }) => {
        const newSubjectLine = subscriptionData.data.subjectLines;
        const previousSubjectLines = previousQueryResult.session.subjectLines;
        _client.cache.writeQuery({
          query: GET_SESSION,
          data: {
            session: {
              ...previousQueryResult.session,
              subjectLines: [...previousSubjectLines, newSubjectLine],
            },
          },
          overwrite: true,
        });
      },
    });
    return () => unsubscribe();
  }, [_client.cache, getSession, sessionId, subscribeToMore]);

  React.useEffect(() => {
    sessionId ? startSessionPolling(300000) : stopSessionPolling();
    return () => {
      stopSessionPolling();
    };
  }, [sessionId, startSessionPolling, stopSessionPolling]);

  return {
    createSession,
    generateSubjectLines,
    getSession,
    session,
  };
};

export default useSidney;
