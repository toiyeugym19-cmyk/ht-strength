import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Subtask = {
    id: string;
    content: string;
    completed: boolean;
};

export type Task = {
    id: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: 'work' | 'personal' | 'life';
    tags: string[];
    completed: boolean;
    date: string;
    subtasks: Subtask[];
    description?: string;
};

export type Column = {
    id: string;
    title: string;
    taskIds: string[];
    color?: string; // For design aesthetic
};

export type BoardState = {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
    columnOrder: string[];

    addTask: (columnId: string, content: string, category?: Task['category'], priority?: Task['priority']) => void;
    deleteTask: (taskId: string) => void;
    moveTask: (sourceColId: string, destColId: string, sourceIndex: number, destIndex: number, taskId: string) => void;
    addColumn: (title: string) => void;
    deleteColumn: (columnId: string) => void;
    toggleTaskCompletion: (taskId: string) => void;

    // Enhanced Actions
    updateTaskDate: (taskId: string, newDate: string) => void;
    addSubtask: (taskId: string, content: string) => void;
    toggleSubtask: (taskId: string, subtaskId: string) => void;
    deleteSubtask: (taskId: string, subtaskId: string) => void;
    updateTaskDetails: (taskId: string, details: Partial<Task>) => void;
};

export const useBoardStore = create<BoardState>()(
    persist(
        (set) => ({
            tasks: {
                'task-1': {
                    id: 'task-1',
                    content: 'Nghiên cứu thị trường',
                    priority: 'medium',
                    category: 'work',
                    completed: false,
                    date: new Date().toISOString(),
                    tags: ['Research', 'Q1'],
                    subtasks: [
                        { id: 'st-1', content: 'Phân tích đối thủ A', completed: true },
                        { id: 'st-2', content: 'Khảo sát khách hàng', completed: false }
                    ]
                },
                'task-2': {
                    id: 'task-2',
                    content: 'Thiết kế Design System',
                    priority: 'high',
                    category: 'work',
                    completed: false,
                    date: new Date().toISOString(),
                    tags: ['UI/UX', 'Figma'],
                    subtasks: []
                },
                'task-3': {
                    id: 'task-3',
                    content: 'Tích hợp Drag & Drop',
                    priority: 'urgent',
                    category: 'work',
                    completed: true,
                    date: new Date().toISOString(),
                    tags: ['Dev', 'Frontend'],
                    subtasks: []
                },
            },
            columns: {
                'col-1': { id: 'col-1', title: 'TODO', taskIds: ['task-1', 'task-2'], color: 'border-white/10' },
                'col-2': { id: 'col-2', title: 'IN PROGRESS', taskIds: ['task-3'], color: 'border-blue-500/50' },
                'col-3': { id: 'col-3', title: 'REVIEW', taskIds: [], color: 'border-yellow-500/50' },
                'col-4': { id: 'col-4', title: 'DONE', taskIds: [], color: 'border-green-500/50' },
            },
            columnOrder: ['col-1', 'col-2', 'col-3', 'col-4'],

            addTask: (columnId, content, category = 'work', priority = 'medium') =>
                set((state) => {
                    const newTaskId = `task-${crypto.randomUUID()}`;
                    const newTask: Task = {
                        id: newTaskId,
                        content,
                        category,
                        priority,
                        completed: false,
                        date: new Date().toISOString(),
                        tags: [],
                        subtasks: []
                    };
                    return {
                        tasks: { ...state.tasks, [newTaskId]: newTask },
                        columns: {
                            ...state.columns,
                            [columnId]: {
                                ...state.columns[columnId],
                                taskIds: [...state.columns[columnId].taskIds, newTaskId],
                            },
                        },
                    };
                }),

            deleteTask: (taskId) =>
                set((state) => {
                    const columnId = Object.keys(state.columns).find(key => state.columns[key].taskIds.includes(taskId));
                    if (!columnId) return state;

                    const newTasks = { ...state.tasks };
                    delete newTasks[taskId];
                    return {
                        tasks: newTasks,
                        columns: {
                            ...state.columns,
                            [columnId]: {
                                ...state.columns[columnId],
                                taskIds: state.columns[columnId].taskIds.filter((id) => id !== taskId),
                            },
                        },
                    };
                }),

            moveTask: (sourceColId, destColId, sourceIndex, destIndex, taskId) =>
                set((state) => {
                    const startCol = state.columns[sourceColId];
                    const finishCol = state.columns[destColId];

                    if (startCol === finishCol) {
                        const newTaskIds = Array.from(startCol.taskIds);
                        newTaskIds.splice(sourceIndex, 1);
                        newTaskIds.splice(destIndex, 0, taskId);
                        return {
                            columns: {
                                ...state.columns,
                                [sourceColId]: { ...startCol, taskIds: newTaskIds },
                            },
                        };
                    } else {
                        const startTaskIds = Array.from(startCol.taskIds);
                        startTaskIds.splice(sourceIndex, 1);

                        const finishTaskIds = Array.from(finishCol.taskIds);
                        finishTaskIds.splice(destIndex, 0, taskId);

                        // If moving to "done" column, auto-mark as completed
                        const isDoneCol = finishCol.title.toLowerCase().includes('done') || finishCol.title.toLowerCase().includes('prod');
                        const updatedTask = isDoneCol ? { ...state.tasks[taskId], completed: true } : state.tasks[taskId];

                        return {
                            tasks: { ...state.tasks, [taskId]: updatedTask },
                            columns: {
                                ...state.columns,
                                [sourceColId]: { ...startCol, taskIds: startTaskIds },
                                [destColId]: { ...finishCol, taskIds: finishTaskIds },
                            },
                        };
                    }
                }),

            addColumn: (title) =>
                set((state) => {
                    const newColId = `col-${crypto.randomUUID()}`;
                    return {
                        columns: { ...state.columns, [newColId]: { id: newColId, title, taskIds: [] } },
                        columnOrder: [...state.columnOrder, newColId]
                    }
                }),

            deleteColumn: (columnId) =>
                set((state) => {
                    if (state.columns[columnId].taskIds.length > 0) return state; // Prevent deleting non-empty
                    const newColumns = { ...state.columns };
                    delete newColumns[columnId];
                    return {
                        columns: newColumns,
                        columnOrder: state.columnOrder.filter(id => id !== columnId)
                    }
                }),

            toggleTaskCompletion: (taskId) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: { ...state.tasks[taskId], completed: !state.tasks[taskId].completed }
                    }
                })),

            updateTaskDate: (taskId, newDate) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: { ...state.tasks[taskId], date: newDate }
                    }
                })),

            addSubtask: (taskId, content) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...state.tasks[taskId],
                            subtasks: [...(state.tasks[taskId].subtasks || []), { id: crypto.randomUUID(), content, completed: false }]
                        }
                    }
                })),

            toggleSubtask: (taskId, subtaskId) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...state.tasks[taskId],
                            subtasks: state.tasks[taskId].subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
                        }
                    }
                })),

            deleteSubtask: (taskId, subtaskId) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: {
                            ...state.tasks[taskId],
                            subtasks: state.tasks[taskId].subtasks.filter(s => s.id !== subtaskId)
                        }
                    }
                })),

            updateTaskDetails: (taskId, details) =>
                set((state) => ({
                    tasks: {
                        ...state.tasks,
                        [taskId]: { ...state.tasks[taskId], ...details }
                    }
                }))
        }),
        {
            name: 'lifeos-board-storage',
            version: 2, // Bump version to force migration if needed (though zustand persist handles merge usually, but type changes might need care. For dev env it's fine)
        }
    )
);
