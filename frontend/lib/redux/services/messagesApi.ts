"use client";

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Message {
  id: number;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ||
  "http://localhost:8080";

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  tagTypes: ["Messages"],
  endpoints: (builder) => ({
    getMessages: builder.query<Message[], void>({
      query: () => "/messages",
      transformResponse: (resp: { success: boolean; data: Message[] }) =>
        resp.data,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Messages" as const, id })),
              { type: "Messages" as const, id: "LIST" },
            ]
          : [{ type: "Messages", id: "LIST" }],
    }),
    createMessage: builder.mutation<Message, { content: string }>({
      query: (body) => ({ url: `/messages`, method: "POST", body }),
      transformResponse: (resp: { success: boolean; data: Message }) =>
        resp.data,
      invalidatesTags: [{ type: "Messages", id: "LIST" }],
    }),
    updateMessage: builder.mutation<Message, { id: number; content: string }>({
      query: ({ id, content }) => ({
        url: `/messages/${id}`,
        method: "PUT",
        body: { content },
      }),
      transformResponse: (resp: { success: boolean; data: Message }) =>
        resp.data,
      invalidatesTags: (_, __, arg) => [
        { type: "Messages", id: arg.id },
        { type: "Messages", id: "LIST" },
      ],
    }),
    deleteMessage: builder.mutation<{ success: boolean }, number>({
      query: (id) => ({ url: `/messages/${id}`, method: "DELETE" }),
      invalidatesTags: (_, __, id) => [
        { type: "Messages", id },
        { type: "Messages", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useCreateMessageMutation,
  useUpdateMessageMutation,
  useDeleteMessageMutation,
} = messagesApi;
