import { useGetRoomsQuery } from "./roomsApiSlice"
import Room from './Room'

const RoomList = () => {

    const {
        data: room,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetRoomsQuery()

    let content

    if (isLoading) content = <p>Loading...</p>

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }

    if (isSuccess) {

        const { ids } = room

        const tableContent = ids?.length
            ? ids.map(roomId => <Room key={roomId} roomId={roomId} />)
            : null

        content = (
            <table className="table table--room">
                <thead className="table__thead">
                    <tr>
                        <th scope="col" className="table__th room__roomname">Roomname</th>
                        <th scope="col" className="table__th room__roles">Roles</th>
                        <th scope="col" className="table__th room__edit">Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>
        )
    }

    return content
}
export default RoomList