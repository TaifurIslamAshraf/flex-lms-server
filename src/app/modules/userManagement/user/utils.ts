import { UserModel } from "./user.model";

export const generateStudentId = async (year: string | undefined, code: string | undefined) => {
    const latestUser = await UserModel.findOne(
        { role: 'student' }).sort({ createdAt: -1 });

    let id
    if (latestUser?.id.substring(0, 4) === year && latestUser?.id.substring(4, 6) === code) {
        const latestId = latestUser?.id.substring(6)
        const latestIdIncrement = parseInt(latestId) + 1
        const newId = String(latestIdIncrement).padStart(latestId.length, '0');
        id = `${year}${code}` + newId
    } else {
        // this.id = this.id + '0001'
        id = `${year}${code}` + (1).toString().padStart(4, '0')
    }

    return id;
}

// Admin ID
export const findLastAdminId = async () => {
    const lastAdmin = await UserModel.findOne(
        {
            role: 'admin',
        },
        {
            id: 1,
            _id: 0,
        },
    )
        .sort({
            createdAt: -1,
        })
        .lean();

    return lastAdmin?.id ? lastAdmin.id.substring(2) : undefined;
};

export const generateAdminId = async () => {
    let currentId = (0).toString();
    const lastAdminId = await findLastAdminId();

    if (lastAdminId) {
        currentId = lastAdminId.substring(2);
    }

    let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

    incrementId = `A-${incrementId}`;
    return incrementId;
};
