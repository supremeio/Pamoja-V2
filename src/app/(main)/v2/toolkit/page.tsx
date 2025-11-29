'use client'

import React, { useState, useRef } from 'react'
import { SideNavigation } from '@/components/v2/SideNavigation'
import { TopNavigation } from '@/components/v2/TopNavigation'
import { QuestionRow } from '@/components/v2/QuestionRow'
import { DeleteModal } from '@/components/v2/DeleteModal'
import { AddQuestionSlideIn } from '@/components/v2/AddQuestionSlideIn'
import { FileUpload } from '@/components/v2/FileUpload'
import { Separator } from '@/components/v2/Separator'
import { useToast, toast } from '@/components/v2/Toast'
import { typography } from '@/lib/typography/v2'

const fontStyle = { fontFamily: typography.medium.fontFamily }
const fontMedium = typography.medium
const fontSemibold = typography.semibold

// Icon assets from local icon library
const img11 = "/icons/v2/upload-icon.svg" // Upload icon
const imgDocumentsIcon = "/icons/v2/documents-icon.svg" // Documents icon
const img12 = "/icons/v2/delete-icon.svg" // Delete icon

interface Question {
  id: string
  question: string
  answer: string
  hasAnswer: boolean
}

interface Document {
  id: string
  fileName: string
  uploadState?: 'uploading' | 'uploaded' | 'error'
  uploadProgress?: number
}

function Toolkit() {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [editingItem, setEditingItem] = useState<string | null>(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null)
  const [isDeleteResumeModalOpen, setIsDeleteResumeModalOpen] = useState(false)
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false)
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null)
  
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc-1',
      fileName: 'Oluwatosin_Zini.pdf'
    }
  ])
  
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'question-1',
      question: 'What project are you most proud of?',
      answer: '',
      hasAnswer: false
    },
    {
      id: 'question-2',
      question: 'What is your design process?',
      answer: `I do not have a strict design process, it's flexible based on the type of project I'm working on. So the steps I take varies on the project type, for example if it's a redesign or a project from scratch, is it a project with a tight timeframe or I have ample time to work on it.  However, I have foundational design principles I adhere to and check my work against. I rely on core principles (e.g., clarity, usability, consistency, accessibility, balance). `,
      hasAnswer: true
    },
    {
      id: 'question-3',
      question: 'What tools do you use?',
      answer: '',
      hasAnswer: false
    },
    {
      id: 'question-4',
      question: 'How do you handle feedback?',
      answer: '',
      hasAnswer: false
    },
    {
      id: 'question-5',
      question: 'Why should we hire you?',
      answer: '',
      hasAnswer: false
    }
  ])

  const toggleExpand = (itemId: string) => {
    setExpandedItem(prev => prev === itemId ? null : itemId)
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestionToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (questionToDelete) {
      // Remove question from list
      setQuestions(prev => prev.filter(q => q.id !== questionToDelete))
      
      // If the deleted question was expanded, collapse it
      if (expandedItem === questionToDelete) {
        setExpandedItem(null)
      }
      
      // If the deleted question was being edited, stop editing
      if (editingItem === questionToDelete) {
        setEditingItem(null)
      }
      
      // TODO: Implement delete question API call
      
      // Show success toast
      showToast(toast.success('Question deleted successfully'))
      
      setQuestionToDelete(null)
    }
  }

  const handleEdit = (id: string) => {
    setEditingItem(id)
    // Expand the item if it's not already expanded
    if (expandedItem !== id) {
      setExpandedItem(id)
    }
  }

  const handleSave = (id: string, newAnswer: string) => {
    // Find the original question to compare
    const originalQuestion = questions.find(q => q.id === id)
    const originalAnswer = originalQuestion?.answer || ''
    const trimmedNewAnswer = newAnswer.trim()
    const trimmedOriginalAnswer = originalAnswer.trim()
    
    // Check if there's a change
    const hasChanged = trimmedNewAnswer !== trimmedOriginalAnswer
    
    if (hasChanged) {
      // Update the answer for the question
      setQuestions(prev => prev.map(q => 
        q.id === id 
          ? { ...q, answer: trimmedNewAnswer, hasAnswer: trimmedNewAnswer.length > 0 }
          : q
      ))
      
      // TODO: Implement save answer API call
      
      // Show success toast
      showToast(toast.success('Answer updated successfully'))
    } else {
      // No changes made, show info toast
      showToast(toast.info('No changes were made'))
    }
    
    // Exit edit mode
    setEditingItem(null)
  }

  const getQuestionToDelete = () => {
    return questions.find(q => q.id === questionToDelete)
  }

  const handleDeleteDocument = (id: string) => {
    setDocumentToDelete(id)
    setIsDeleteResumeModalOpen(true)
  }

  const handleConfirmDeleteDocument = () => {
    if (documentToDelete) {
      // Remove document from list
      setDocuments(prev => prev.filter(doc => doc.id !== documentToDelete))
      
      // TODO: Implement delete document API call
      
      // Show success toast
      showToast(toast.success('Document deleted successfully'))
      
      setDocumentToDelete(null)
      setIsDeleteResumeModalOpen(false)
    }
  }

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validExtensions = ['.pdf', '.doc', '.docx']
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
    
    if (!validExtensions.includes(fileExtension)) {
      showToast(toast.error('Invalid file type. Please upload a .pdf, .doc, or .docx file.'))
      return
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      showToast(toast.error('File too large. Maximum size is 10MB.'))
      return
    }

    // Create new document immediately with uploading state
    const newDocumentId = `doc-${Date.now()}`
    const newDocument: Document = {
      id: newDocumentId,
      fileName: file.name,
      uploadState: 'uploading',
      uploadProgress: 0
    }
    
    // Add document to list immediately
    setDocuments(prev => [...prev, newDocument])

    // Simulate upload progress
    let currentProgress = 0
    let toastShown = false
    const progressInterval = setInterval(() => {
      currentProgress += 2
      
      // Update document progress in the list
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === newDocumentId 
            ? { ...doc, uploadProgress: currentProgress }
            : doc
        )
      )
      
      if (currentProgress >= 100 && !toastShown) {
        clearInterval(progressInterval)
        toastShown = true
        
        // Update document state to uploaded
        setDocuments(prevDocs => 
          prevDocs.map(doc => 
            doc.id === newDocumentId 
              ? { ...doc, uploadState: 'uploaded', uploadProgress: 100 }
              : doc
          )
        )
        
        showToast(toast.success('Document uploaded successfully'))
      }
    }, 50)

    // TODO: Replace with actual API call
    // await uploadDocument(file)
  }

  const handleUploadDocument = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
    // Reset the input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAddQuestions = (questionsData: Array<{ question: string; answer: string }>) => {
    // Create new questions from the submitted data
    const newQuestions: Question[] = questionsData.map((q, index) => ({
      id: `question-${Date.now()}-${index}`,
      question: q.question,
      answer: q.answer,
      hasAnswer: q.answer.length > 0
    }))
    
    // Add questions to list
    setQuestions(prev => [...prev, ...newQuestions])
    
    // TODO: Implement add questions API call
    
    // Show success toast
    const count = newQuestions.length
    showToast(toast.success(`${count} question${count > 1 ? 's' : ''} added successfully`))
  }

  return (
    <div className="bg-v2-background-primary content-stretch flex flex-col gap-[40px] items-center relative w-full min-h-screen" style={fontStyle}>
      <TopNavigation />
      <div className="basis-0 box-border content-stretch flex flex-col gap-[10px] grow items-start min-h-px min-w-px px-[80px] py-0 relative shrink-0 w-full">
        <div className="basis-0 content-stretch flex gap-[40px] grow items-start min-h-px min-w-px relative shrink-0 w-full">
          <SideNavigation className="box-border content-stretch flex flex-col gap-[17px] h-full items-start p-[24px] relative rounded-[16px] shrink-0 w-[280px]" />
          <div className="basis-0 box-border content-stretch flex flex-col gap-[40px] grow h-full items-start min-h-px min-w-px p-[24px] relative shrink-0 transition-all duration-300 ease-in-out">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
              <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
                <div className="content-stretch flex flex-col gap-[4px] items-start not-italic relative shrink-0">
                  <p className="leading-[1.5] relative shrink-0 text-[18px] text-v2-text-primary w-full" style={fontSemibold}>
                    Toolkit
                  </p>
                  <p className="leading-[1.7] relative shrink-0 text-[14px] text-v2-text-secondary w-full" style={fontMedium}>
                    Manage your documents and personalize your AI experience
                  </p>
                </div>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={handleUploadDocument}
                    className="bg-v2-brand-primary box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] active:opacity-95"
                  >
                    <div className="relative shrink-0 size-[20px]">
                      <div className="absolute contents inset-0">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="block max-w-none size-full">
                          <path d="M5 10H15" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M10 15V5" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                    <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                      Upload document
                    </p>
                  </button>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[40px] items-start relative shrink-0 w-full">
              <div className="basis-0 bg-[rgba(255,255,255,0.02)] box-border content-stretch flex flex-col gap-[16px] grow items-start min-h-px min-w-px p-[16px] relative rounded-[12px] shrink-0">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <p className="leading-[1.5] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre" style={fontSemibold}>
                    Questions and answers
                  </p>
                  <button 
                    onClick={() => setIsAddQuestionModalOpen(true)}
                    className="bg-v2-background-secondary box-border content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:bg-v2-background-primary hover:scale-[1.02] active:scale-[0.98] active:opacity-90"
                  >
                    <div className="relative shrink-0 size-[20px]">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="block max-w-none size-full">
                        <path d="M5 10H15" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10 15V5" stroke="#ffffff" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className="leading-[20px] not-italic relative shrink-0 text-[14px] text-v2-text-primary text-nowrap whitespace-pre" style={fontMedium}>
                      Add question
                    </p>
                  </button>
                </div>
                <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                  {questions.map((q, index) => (
                    <QuestionRow
                      key={q.id}
                      id={q.id}
                      question={q.question}
                      answer={q.answer}
                      hasAnswer={q.hasAnswer}
                      isExpanded={expandedItem === q.id}
                      isEditing={editingItem === q.id}
                      onToggleExpand={toggleExpand}
                      onDelete={handleDeleteQuestion}
                      onEdit={handleEdit}
                      onSave={handleSave}
                      onCopy={(_id) => {
                        // TODO: Implement copy functionality
                      }}
                      showDivider={index < questions.length - 1}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-v2-background-primary border border-v2-border border-solid box-border content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[12px] shrink-0 w-[320px]">
                <p className="leading-[28px] not-italic relative shrink-0 text-[18px] text-v2-text-primary text-nowrap whitespace-pre" style={fontSemibold}>
                  Your documents
                </p>
                <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                  <Separator />
                  <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                    {/* Upload Document Button - Always visible */}
                    <button
                      type="button"
                      onClick={handleUploadDocument}
                      className="bg-v2-background-primary border border-[#8aa8ba] border-solid box-border content-stretch flex gap-[4px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer transition-all duration-200 ease-in-out hover:opacity-90"
                    >
                      <div className="relative shrink-0 size-[20px]">
                        <div className="absolute contents inset-0">
                          <img alt="" className="block max-w-none size-full" src={img11} />
                        </div>
                      </div>
                      <p className="font-['Figtree:Medium',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#8aa8ba] text-[14px] text-nowrap whitespace-pre" style={fontMedium}>
                        Upload document (.pdf, docs)
                      </p>
                    </button>
                    {/* Documents Display - Show all uploaded documents */}
                    {documents.length > 0 && (
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        {documents.map((doc) => {
                          // Show FileUpload component if document is uploading
                          if (doc.uploadState === 'uploading') {
                            return (
                              <FileUpload
                                key={doc.id}
                                fileName={doc.fileName}
                                state="uploading"
                                uploadProgress={doc.uploadProgress || 0}
                                fullWidth={true}
                                className="w-full"
                                onRetry={() => {
                                  // TODO: Implement retry logic
                                }}
                                onDelete={() => {
                                  // Remove document from list if user cancels during upload
                                  setDocuments(prev => prev.filter(d => d.id !== doc.id))
                                }}
                              />
                            )
                          }
                          
                          // Show regular document item for uploaded documents
                          return (
                            <div key={doc.id} className="bg-v2-background-secondary box-border content-stretch flex items-center justify-between p-[16px] relative rounded-[8px] shrink-0 w-full">
                              <div className="basis-0 content-stretch flex gap-[4px] grow items-center min-h-px min-w-px relative shrink-0 overflow-hidden">
                                <div className="relative shrink-0 size-[20px]">
                                  <img alt="" className="block max-w-none size-full" src={imgDocumentsIcon} />
                                </div>
                                <p className="basis-0 grow leading-[20px] min-h-px min-w-px not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[14px] text-v2-text-primary text-nowrap" style={fontMedium}>
                                  {doc.fileName}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="relative shrink-0 size-[20px] cursor-pointer hover:opacity-80 transition-opacity"
                              >
                                <div className="absolute contents inset-0">
                                  <img alt="" className="block max-w-none size-full" src={img12} />
                                </div>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Question Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setQuestionToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        title="Delete question?"
        description={questionToDelete ? `Deleting "${getQuestionToDelete()?.question}" will remove it from your list and cannot be undone.` : 'Deleting this question will remove it from your list and cannot be undone.'}
        confirmButtonText="Delete question"
      />
      {/* Delete Document Modal */}
      <DeleteModal
        isOpen={isDeleteResumeModalOpen}
        onClose={() => {
          setIsDeleteResumeModalOpen(false)
          setDocumentToDelete(null)
        }}
        onConfirm={handleConfirmDeleteDocument}
        title="Delete document?"
        description={documentToDelete ? `Deleting "${documents.find(doc => doc.id === documentToDelete)?.fileName}" will remove it from your list and cannot be undone.` : 'Deleting this document will remove it from your list and cannot be undone.'}
        confirmButtonText="Delete document"
      />
      {/* Add Question Slide-In */}
      <AddQuestionSlideIn
        isOpen={isAddQuestionModalOpen}
        onClose={() => setIsAddQuestionModalOpen(false)}
        onSubmit={handleAddQuestions}
      />
    </div>
  )
}

export default React.memo(Toolkit)
