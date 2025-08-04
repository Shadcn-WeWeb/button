<template>
  <div class="w-full">
    <div 
      :class="cn(
        'flex gap-2 justify-center',
        content.alignment === 'left' && 'justify-start',
        content.alignment === 'right' && 'justify-end',
        content.disabled && 'opacity-50 cursor-not-allowed'
      )"
    >
      <input
        v-for="(digit, index) in digits"
        :key="index"
        :ref="el => inputRefs[index] = el"
        v-model="digits[index]"
        :type="content.password ? 'password' : 'text'"
        :maxlength="1"
        :disabled="content.disabled"
        :class="cn(
          // Base styles
          'flex h-10 w-10 rounded-md border border-input bg-background text-center text-sm font-medium text-foreground',
          'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          // Size variants
          content.size === 'sm' && 'h-8 w-8 text-xs',
          content.size === 'lg' && 'h-12 w-12 text-base',
          // Error state
          hasError && 'border-destructive',
          // Success state  
          isComplete && !hasError && 'border-green-500',
          content.customClass
        )"
        @input="onInput(index, $event)"
        @keydown="onKeyDown(index, $event)"
        @paste="onPaste($event)"
        @focus="onFocus(index)"
        @blur="onBlur"
        :placeholder="content.showPlaceholder ? '•' : ''"
      />
    </div>
    
    <!-- Error message -->
    <div 
      v-if="hasError && content.errorMessage" 
      class="mt-2 text-sm text-destructive"
    >
      {{ content.errorMessage }}
    </div>
    
    <!-- Help text -->
    <div 
      v-if="content.helpText && !hasError" 
      class="mt-2 text-sm text-muted-foreground"
    >
      {{ content.helpText }}
    </div>
    
    <!-- Timer for resend -->
    <div 
      v-if="content.showTimer && timer > 0"
      class="mt-2 text-sm text-muted-foreground text-center"
    >
      {{ $t('inputOtp.resendIn') }} {{ timer }}s
    </div>
    
    <!-- Resend button -->
    <div 
      v-if="content.showResend && timer === 0"
      class="mt-2 text-center"
    >
      <button
        @click="onResend"
        :disabled="content.disabled"
        class="text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ $t('inputOtp.resendCode') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { cn } from './cn.js'

const props = defineProps({
  content: {
    type: Object,
    default: () => ({})
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue', 'complete', 'change', 'resend', 'focus', 'blur'])

// Reactive data
const digits = ref([])
const inputRefs = ref([])
const timer = ref(0)
const timerInterval = ref(null)

// Computed properties
const numDigits = computed(() => content.value?.length || 6)
const isComplete = computed(() => 
  digits.value.length === numDigits.value && 
  digits.value.every(digit => digit !== '')
)
const hasError = computed(() => content.value?.hasError || false)
const currentValue = computed(() => digits.value.join(''))

// Initialize digits array
const initializeDigits = () => {
  const value = props.modelValue || ''
  digits.value = Array(numDigits.value).fill('').map((_, i) => value[i] || '')
}

// Input handlers
const onInput = (index, event) => {
  const value = event.target.value
  
  // Only allow alphanumeric characters if specified
  if (content.value?.alphanumeric && !/^[a-zA-Z0-9]*$/.test(value)) {
    event.target.value = digits.value[index]
    return
  }
  
  // Only allow numbers if specified
  if (content.value?.numbersOnly && !/^[0-9]*$/.test(value)) {
    event.target.value = digits.value[index]
    return
  }
  
  digits.value[index] = value.toUpperCase()
  
  // Auto-focus next input
  if (value && index < numDigits.value - 1) {
    nextTick(() => {
      inputRefs.value[index + 1]?.focus()
    })
  }
  
  emitValue()
}

const onKeyDown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace' && !digits.value[index] && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  
  // Handle arrow keys
  if (event.key === 'ArrowLeft' && index > 0) {
    inputRefs.value[index - 1]?.focus()
  }
  
  if (event.key === 'ArrowRight' && index < numDigits.value - 1) {
    inputRefs.value[index + 1]?.focus()
  }
  
  // Handle Enter
  if (event.key === 'Enter' && isComplete.value) {
    emit('complete', currentValue.value)
  }
}

const onPaste = (event) => {
  event.preventDefault()
  const pasteData = event.clipboardData.getData('text').slice(0, numDigits.value)
  
  // Validate paste data
  if (content.value?.numbersOnly && !/^[0-9]*$/.test(pasteData)) {
    return
  }
  
  if (content.value?.alphanumeric && !/^[a-zA-Z0-9]*$/.test(pasteData)) {
    return
  }
  
  // Fill digits with pasted data
  for (let i = 0; i < numDigits.value; i++) {
    digits.value[i] = pasteData[i]?.toUpperCase() || ''
  }
  
  // Focus last filled input or next empty
  const lastFilledIndex = Math.min(pasteData.length - 1, numDigits.value - 1)
  nextTick(() => {
    inputRefs.value[lastFilledIndex]?.focus()
  })
  
  emitValue()
}

const onFocus = (index) => {
  emit('focus', { index, value: currentValue.value })
}

const onBlur = () => {
  emit('blur', currentValue.value)
}

const onResend = () => {
  if (content.value?.resendCooldown) {
    startTimer()
  }
  emit('resend')
}

// Timer functions
const startTimer = () => {
  timer.value = content.value?.resendCooldown || 60
  timerInterval.value = setInterval(() => {
    timer.value--
    if (timer.value <= 0) {
      clearInterval(timerInterval.value)
      timerInterval.value = null
    }
  }, 1000)
}

const emitValue = () => {
  const value = currentValue.value
  emit('update:modelValue', value)
  emit('change', value)
  
  if (isComplete.value) {
    emit('complete', value)
  }
}

// Public methods
const clear = () => {
  digits.value = Array(numDigits.value).fill('')
  emitValue()
  inputRefs.value[0]?.focus()
}

const focus = () => {
  const firstEmptyIndex = digits.value.findIndex(digit => !digit)
  const focusIndex = firstEmptyIndex >= 0 ? firstEmptyIndex : 0
  inputRefs.value[focusIndex]?.focus()
}

// Watchers
watch(() => props.modelValue, (newValue) => {
  if (newValue !== currentValue.value) {
    initializeDigits()
  }
})

watch(() => content.value?.length, () => {
  initializeDigits()
})

// Lifecycle
onMounted(() => {
  initializeDigits()
  
  if (content.value?.autoFocus) {
    nextTick(() => {
      focus()
    })
  }
  
  if (content.value?.showTimer && content.value?.resendCooldown) {
    startTimer()
  }
})

onUnmounted(() => {
  if (timerInterval.value) {
    clearInterval(timerInterval.value)
  }
})

// Expose methods
defineExpose({
  clear,
  focus
})
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 