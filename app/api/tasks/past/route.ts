import { TaskGeneratorService } from "@/services/taskGeneratorService";
import { NextResponse } from "next/server";


const GET = async () => {
    try {
        const checkTaskStatus = await TaskGeneratorService.getPastTasks();
        return NextResponse.json({ message: 'Task status checked successfully', checkTaskStatus }, { status: 200 });
    }
    catch (error) {
        console.error('Error checking task status:', error);
        return NextResponse.json({ message: 'Failed to check task status' }, { status: 500 });
    }
}

export { GET }