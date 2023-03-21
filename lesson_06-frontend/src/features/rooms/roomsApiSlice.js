import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const roomsAdapter = createEntityAdapter({})

const initialState = roomsAdapter.getInitialState()

export const roomsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getRooms: builder.query({
            query: () => '/rooms',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedRooms = responseData.map(room => {
                    room.id = room._id
                    return room
                });
                return roomsAdapter.setAll(initialState, loadedRooms)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Room', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Room', id }))
                    ]
                } else return [{ type: 'Room', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetRoomsQuery,
} = roomsApiSlice

// returns the query result object
export const selectRoomsResult = roomsApiSlice.endpoints.getRooms.select()

// creates memoized selector
const selectRoomsData = createSelector(
    selectRoomsResult,
    roomsResult => roomsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllRooms,
    selectById: selectRoomById,
    selectIds: selectRoomIds
    // Pass in a selector that returns the rooms slice of state
} = roomsAdapter.getSelectors(state => selectRoomsData(state) ?? initialState)