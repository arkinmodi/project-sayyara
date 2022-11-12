import { NextPage } from "next";
import { useRouter } from "next/router";
import { DatePicker } from "@blueprintjs/datetime";

const RequestAppointment: NextPage = () => {
    const router = useRouter();
    

    return (
        <div>
            <DatePicker
                onChange={newDate => }
                value={}
            />
        </div>
    );

}

export default RequestAppointment;