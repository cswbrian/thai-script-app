import React from 'react'
import { useParams } from 'react-router-dom'

const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>()

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Lesson {lessonId}
        </h1>
        <p className="text-gray-600">
          Interactive lesson content
        </p>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <p className="text-gray-500">
          Lesson content will be implemented in Task 4.0
        </p>
      </div>
    </div>
  )
}

export default LessonPage
