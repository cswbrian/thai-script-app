import React, { useState } from 'react'
import { 
  HeartIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import {
  TouchButton,
  TouchCard,
  TouchInput,
  TouchToggle,
  TouchListItem,
  TouchGrid
} from '../ui/TouchComponents'
import {
  ResponsiveText,
  ResponsiveHeading,
  ResponsiveParagraph,
  ResponsiveBadge,
  ResponsiveTextBlock
} from '../ui/ResponsiveTypography'
import {
  SwipeableCard,
  SwipeableListItem,
  SwipeableCarousel,
  SwipeableModal
} from '../ui/SwipeGestures'

const MobileFirstDemo: React.FC = () => {
  const [inputValue, setInputValue] = useState('')
  const [toggleValue, setToggleValue] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  const carouselItems = [
    <div key="1" className="bg-blue-100 p-8 text-center rounded-lg">
      <ResponsiveHeading level={2}>Slide 1</ResponsiveHeading>
      <ResponsiveParagraph>This is the first slide of the carousel</ResponsiveParagraph>
    </div>,
    <div key="2" className="bg-green-100 p-8 text-center rounded-lg">
      <ResponsiveHeading level={2}>Slide 2</ResponsiveHeading>
      <ResponsiveParagraph>This is the second slide of the carousel</ResponsiveParagraph>
    </div>,
    <div key="3" className="bg-purple-100 p-8 text-center rounded-lg">
      <ResponsiveHeading level={2}>Slide 3</ResponsiveHeading>
      <ResponsiveParagraph>This is the third slide of the carousel</ResponsiveParagraph>
    </div>
  ]

  const listItems = [
    { id: '1', title: 'Character ก', subtitle: 'ko kai' },
    { id: '2', title: 'Character ข', subtitle: 'kho khai' },
    { id: '3', title: 'Character ฃ', subtitle: 'kho khuat' },
    { id: '4', title: 'Character ค', subtitle: 'kho khwai' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 p-4 space-y-8">
      {/* Header */}
      <ResponsiveTextBlock spacing="normal" animate>
        <ResponsiveHeading level={1} thai animate>
          Mobile-First UI Demo
        </ResponsiveHeading>
        <ResponsiveParagraph color="secondary">
          Showcasing touch-friendly components, responsive typography, and swipe gestures
        </ResponsiveParagraph>
      </ResponsiveTextBlock>

      {/* Touch-Friendly Components Section */}
      <section className="space-y-6">
        <ResponsiveHeading level={2}>Touch-Friendly Components</ResponsiveHeading>
        
        {/* Touch Buttons */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Touch Buttons</ResponsiveHeading>
          <TouchGrid columns={2} gap="md">
            <TouchButton variant="primary" icon={<HeartIcon className="h-4 w-4" />}>
              Primary
            </TouchButton>
            <TouchButton variant="secondary" icon={<StarIcon className="h-4 w-4" />} iconPosition="right">
              Secondary
            </TouchButton>
            <TouchButton variant="success" size="lg">
              Success Large
            </TouchButton>
            <TouchButton variant="danger" size="sm" loading>
              Loading
            </TouchButton>
          </TouchGrid>
        </div>

        {/* Touch Cards */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Touch Cards</ResponsiveHeading>
          <TouchGrid columns={1} gap="md">
            <TouchCard hoverable onClick={() => alert('Card clicked!')}>
              <div className="p-4">
                <ResponsiveHeading level={4}>Interactive Card</ResponsiveHeading>
                <ResponsiveParagraph>Tap this card to see the interaction</ResponsiveParagraph>
              </div>
            </TouchCard>
            <TouchCard selected>
              <div className="p-4">
                <ResponsiveHeading level={4}>Selected Card</ResponsiveHeading>
                <ResponsiveParagraph>This card is in a selected state</ResponsiveParagraph>
              </div>
            </TouchCard>
          </TouchGrid>
        </div>

        {/* Touch Inputs */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Touch Inputs</ResponsiveHeading>
          <div className="space-y-4">
            <TouchInput
              value={inputValue}
              onChange={setInputValue}
              placeholder="Enter text here..."
              label="Text Input"
              fullWidth
            />
            <TouchInput
              value=""
              onChange={() => {}}
              placeholder="Disabled input"
              disabled
              label="Disabled Input"
              fullWidth
            />
          </div>
        </div>

        {/* Touch Toggle */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Touch Toggle</ResponsiveHeading>
          <TouchToggle
            checked={toggleValue}
            onChange={setToggleValue}
            label="Enable notifications"
            size="lg"
          />
        </div>
      </section>

      {/* Responsive Typography Section */}
      <section className="space-y-6">
        <ResponsiveHeading level={2}>Responsive Typography</ResponsiveHeading>
        
        <ResponsiveTextBlock spacing="normal">
          <ResponsiveHeading level={1} thai animate>
            ก ข ฃ ค ฅ ฆ
          </ResponsiveHeading>
          <ResponsiveHeading level={2} animate>
            Thai Script Learning
          </ResponsiveHeading>
          <ResponsiveHeading level={3} animate>
            Responsive Headings
          </ResponsiveHeading>
          <ResponsiveParagraph size="lg" animate>
            This paragraph demonstrates responsive typography that scales appropriately across different screen sizes.
          </ResponsiveParagraph>
          <ResponsiveParagraph animate>
            Smaller text that remains readable on mobile devices while scaling up beautifully on larger screens.
          </ResponsiveParagraph>
        </ResponsiveTextBlock>

        <div className="flex flex-wrap gap-2">
          <ResponsiveBadge variant="default" animate>Default</ResponsiveBadge>
          <ResponsiveBadge variant="success" animate>Success</ResponsiveBadge>
          <ResponsiveBadge variant="warning" animate>Warning</ResponsiveBadge>
          <ResponsiveBadge variant="danger" animate>Danger</ResponsiveBadge>
          <ResponsiveBadge variant="info" animate>Info</ResponsiveBadge>
        </div>
      </section>

      {/* Swipe Gestures Section */}
      <section className="space-y-6">
        <ResponsiveHeading level={2}>Swipe Gestures</ResponsiveHeading>
        
        {/* Swipeable Card */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Swipeable Card</ResponsiveHeading>
          <SwipeableCard
            onSwipeLeft={() => alert('Swiped left!')}
            onSwipeRight={() => alert('Swiped right!')}
            onSwipeUp={() => alert('Swiped up!')}
            onSwipeDown={() => alert('Swiped down!')}
          >
            <TouchCard>
              <div className="p-6 text-center">
                <ResponsiveHeading level={4}>Swipe Me!</ResponsiveHeading>
                <ResponsiveParagraph>
                  Try swiping in any direction to see the gesture in action
                </ResponsiveParagraph>
              </div>
            </TouchCard>
          </SwipeableCard>
        </div>

        {/* Swipeable List */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Swipeable List</ResponsiveHeading>
          <div className="space-y-2">
            {listItems.map((item) => (
              <SwipeableListItem
                key={item.id}
                onSwipeLeft={() => {
                  setSelectedItem(item.id)
                  alert(`Swiped left on ${item.title}`)
                }}
                onSwipeRight={() => {
                  setSelectedItem(item.id)
                  alert(`Swiped right on ${item.title}`)
                }}
                leftAction={<TrashIcon className="h-5 w-5" />}
                rightAction={<PencilIcon className="h-5 w-5" />}
              >
                <TouchListItem
                  onClick={() => setSelectedItem(item.id)}
                  selected={selectedItem === item.id}
                >
                  <div>
                    <ResponsiveText variant="body" weight="semibold">
                      {item.title}
                    </ResponsiveText>
                    <ResponsiveText variant="caption" color="muted">
                      {item.subtitle}
                    </ResponsiveText>
                  </div>
                </TouchListItem>
              </SwipeableListItem>
            ))}
          </div>
        </div>

        {/* Swipeable Carousel */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Swipeable Carousel</ResponsiveHeading>
          <div className="flex items-center justify-between mb-4">
            <TouchButton
              variant="secondary"
              size="sm"
              onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
              disabled={carouselIndex === 0}
              icon={<ArrowLeftIcon className="h-4 w-4" />}
            >
              Previous
            </TouchButton>
            <ResponsiveText variant="body" weight="medium">
              {carouselIndex + 1} of {carouselItems.length}
            </ResponsiveText>
            <TouchButton
              variant="secondary"
              size="sm"
              onClick={() => setCarouselIndex(Math.min(carouselItems.length - 1, carouselIndex + 1))}
              disabled={carouselIndex === carouselItems.length - 1}
              icon={<ArrowRightIcon className="h-4 w-4" />}
              iconPosition="right"
            >
              Next
            </TouchButton>
          </div>
          <SwipeableCarousel
            currentIndex={carouselIndex}
            onIndexChange={setCarouselIndex}
          >
            {carouselItems}
          </SwipeableCarousel>
        </div>

        {/* Swipeable Modal */}
        <div className="space-y-4">
          <ResponsiveHeading level={3}>Swipeable Modal</ResponsiveHeading>
          <TouchButton
            variant="primary"
            onClick={() => setModalOpen(true)}
            icon={<StarIcon className="h-4 w-4" />}
          >
            Open Swipeable Modal
          </TouchButton>
          
          <SwipeableModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            swipeToClose={true}
          >
            <div className="p-6">
              <ResponsiveHeading level={3} className="mb-4">
                Swipeable Modal
              </ResponsiveHeading>
              <ResponsiveParagraph className="mb-6">
                This modal can be closed by swiping down or tapping the backdrop.
              </ResponsiveParagraph>
              <div className="flex space-x-3">
                <TouchButton
                  variant="secondary"
                  onClick={() => setModalOpen(false)}
                  icon={<XMarkIcon className="h-4 w-4" />}
                >
                  Close
                </TouchButton>
                <TouchButton
                  variant="primary"
                  onClick={() => setModalOpen(false)}
                  icon={<CheckIcon className="h-4 w-4" />}
                >
                  Confirm
                </TouchButton>
              </div>
            </div>
          </SwipeableModal>
        </div>
      </section>

      {/* Instructions */}
      <section className="bg-blue-50 rounded-lg p-6">
        <ResponsiveHeading level={3} className="mb-4">
          How to Use
        </ResponsiveHeading>
        <ResponsiveTextBlock spacing="tight">
          <ResponsiveParagraph>
            • <strong>Touch Components:</strong> All buttons and interactive elements have minimum 44px height for easy touch interaction
          </ResponsiveParagraph>
          <ResponsiveParagraph>
            • <strong>Responsive Typography:</strong> Text scales appropriately from mobile to desktop screens
          </ResponsiveParagraph>
          <ResponsiveParagraph>
            • <strong>Swipe Gestures:</strong> Swipe cards, list items, and carousel slides in different directions
          </ResponsiveParagraph>
          <ResponsiveParagraph>
            • <strong>Accessibility:</strong> All components include proper ARIA labels and keyboard navigation
          </ResponsiveParagraph>
        </ResponsiveTextBlock>
      </section>
    </div>
  )
}

export default MobileFirstDemo
