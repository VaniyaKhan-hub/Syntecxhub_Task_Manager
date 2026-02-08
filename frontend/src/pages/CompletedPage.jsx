import React, { useState, useMemo } from 'react';
import { layoutClasses } from '../assets/dummy';
import { CheckCircle2 } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const CompletedPage = () => {
  const { tasks = [] } = useOutletContext();

  const [sortBy, setSortBy] = useState('newest');

  const sortedCompletedTasks = useMemo(() => {
    const filtered = tasks.filter((t) => {
      if (typeof t.completed === 'boolean') return t.completed === true;
      if (typeof t.completed === 'number') return t.completed === 1;
      if (typeof t.completed === 'string')
        return t.completed.toLowerCase() === 'yes';
      return false;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      const order = { high: 3, medium: 2, low: 1 };
      return (
        order[b.priority?.toLowerCase()] -
        order[a.priority?.toLowerCase()]
      );
    });
  }, [tasks, sortBy]);

  return (
    <div className={layoutClasses.container}>
      <div className={layoutClasses.headerWrapper}>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            Completed Tasks
          </h1>

          <p className="text-sm text-gray-500 mt-1 ml-7">
            {sortBy}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {sortedCompletedTasks.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No completed tasks yet 🙂  
            Finish something and come back!
          </p>
        ) : (
          sortedCompletedTasks.map((task) => (
            <div
              key={task._id}
              className="p-4 bg-white rounded-lg shadow-sm border border-green-200"
            >
              <h3 className="font-medium text-gray-500 line-through">
                {task.title}
              </h3>

              {task.description && (
                <p className="text-sm text-gray-400 mt-1">
                  {task.description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompletedPage;
