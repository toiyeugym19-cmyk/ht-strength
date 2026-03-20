---
name: GraphQL API
description: GraphQL patterns, schemas, resolvers, and best practices
---

# GraphQL

## Schema Definition

```graphql
type Member {
  id: ID!
  name: String!
  email: String!
  workouts: [Workout!]!
}

type Query {
  members: [Member!]!
  member(id: ID!): Member
}

type Mutation {
  createMember(input: MemberInput!): Member!
  updateMember(id: ID!, input: MemberInput!): Member!
  deleteMember(id: ID!): Boolean!
}

input MemberInput {
  name: String!
  email: String!
}
```

## Resolvers

```typescript
const resolvers = {
  Query: {
    members: () => memberService.findAll(),
    member: (_parent, { id }) => memberService.findById(id)
  },
  Mutation: {
    createMember: (_parent, { input }) => memberService.create(input),
    updateMember: (_parent, { id, input }) => memberService.update(id, input),
    deleteMember: (_parent, { id }) => memberService.delete(id)
  },
  Member: {
    workouts: (parent) => workoutService.findByMemberId(parent.id)
  }
};
```

## Client Usage

```typescript
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_MEMBERS = gql`
  query GetMembers {
    members {
      id
      name
      email
    }
  }
`;

function MemberList() {
  const { data, loading } = useQuery(GET_MEMBERS);
  
  if (loading) return <Spinner />;
  
  return <ul>{data.members.map(m => <li key={m.id}>{m.name}</li>)}</ul>;
}
```
