import {
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice"

const reservationsAdapter = createEntityAdapter({})

const initialState = reservationsAdapter.getInitialState()

export const reservationsApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getReservations: builder.query({
            query: () => '/reservations',
            validateStatus: (response, result) => {
                return response.status === 200 && !result.isError
            },
            keepUnusedDataFor: 5,
            transformResponse: responseData => {
                const loadedReservations = responseData.map(reservation => {
                    reservation.id = reservation._id
                    return reservation
                });
                return reservationsAdapter.setAll(initialState, loadedReservations)
            },
            providesTags: (result, error, arg) => {
                if (result?.ids) {
                    return [
                        { type: 'Reservation', id: 'LIST' },
                        ...result.ids.map(id => ({ type: 'Reservation', id }))
                    ]
                } else return [{ type: 'Reservation', id: 'LIST' }]
            }
        }),
    }),
})

export const {
    useGetReservationsQuery,
} = reservationsApiSlice

// returns the query result object
export const selectReservationsResult = reservationsApiSlice.endpoints.getReservations.select()

// creates memoized selector
const selectReservationsData = createSelector(
    selectReservationsResult,
    reservationsResult => reservationsResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
    selectAll: selectAllReservations,
    selectById: selectReservationById,
    selectIds: selectReservationIds
    // Pass in a selector that returns the reservations slice of state
} = reservationsAdapter.getSelectors(state => selectReservationsData(state) ?? initialState)