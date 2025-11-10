'use client'

import { useState, useEffect, useCallback } from 'react'

// Secuencia de letras proporcionada por el usuario
const LETTER_SEQUENCE = [
  'abedebacdecabedebadeecbadcedbabacdeceabd',
  'eecbadcedbabacdeceabdabcdebacdecabedcbad',
  'abedcbadeecbadcedbabcdebacdecabacdeceabd',
  'bedebacdecabacdeceabdabedcbadeecbadcedba',
  'abcdebacdecabedebadeecbadcedbabacdeceabd',
  'cbadcedbabacdeceabdabcdebacdecabedcbadee',
  'bodebacdecabedcbadeecbadcedbabacdeceabde',
  'cbadcedbabacdeceabdabcdebacdecabedebadee',
  'bodebacdecabedcbadeeabcdebacdecabedcbade',
  'dcedbabacdeceabdaabcdebacdecabedcbadebed',
  'adebebadeecbadcedbabcdebacdecabacdeceabd',
  'abcdebacdecabedcbadeecbadcedbabacdeceabd',
  'eecbadcedbabacdeceabdabcdebacdecabedcbad',
  'abedcbadeecbadcedbabcdebacdecabacdeceabd',
  'abedebacdecabedcbadeecbadcedbabacdeceabd',
  'cbadcedbabacdeceabdabcdebacdecabedcbadee',
  'bedebacdecabedcbadeecbadcedbabacdeceabde',
  'cbadcedbabacdeceabdabcdebacdecabedcbadee',
  'abedcbadeecbadcedbabcdebacdecabacdeceabd',
  'bedebacdecabacdeceabdabedcadeecbadcedba',
  'bedebacdecabedebadeeabcdebacdecabedcbade',
  'abedebacdecabedcbadeecbadcedbabacdeceabd',
  'eecbadcedbabacdeceabdabcdebacdecabedobad',
  'abedcbadeecbadcedbabcdebacdecabacdeceabd',
  'bodebacdecabacdeceabdabedcbadeecbadcedba',
  'abedebacdecabedebadeecbadcedbabacdeceabd',
  'cbadcedbabacdeceabdabcdebacdecabedcbadee',
  'bedebacdecabedcbadeecbadcedbabacdeceabde',
  'cbadcedbabacdeceabdabcdebacdecabedcbadee',
]

const INSTRUCTION = 'Debes tachar únicamente aquellas letras "c" que vayan precedidas de "a", o vayan seguidas de "e"'
const TIME_LIMIT = 3 * 60 // 3 minutos en segundos

type LetterState = 'normal' | 'selected' | 'correct' | 'incorrect'

interface LetterData {
  char: string
  row: number
  col: number
  state: LetterState
}

export default function ExperimentPage() {
  const [letters, setLetters] = useState<LetterData[]>([])
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT)
  const [isRunning, setIsRunning] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const [results, setResults] = useState<{
    totalSelected: number
    correct: number
    incorrect: number
    missed: number
  } | null>(null)

  // Inicializar las letras
  useEffect(() => {
    const letterArray: LetterData[] = []
    LETTER_SEQUENCE.forEach((row, rowIndex) => {
      row.split('').forEach((char, colIndex) => {
        letterArray.push({
          char: char.toLowerCase(),
          row: rowIndex,
          col: colIndex,
          state: 'normal',
        })
      })
    })
    setLetters(letterArray)
  }, [])

  // Función para verificar si una 'c' debe ser seleccionada
  const shouldSelectC = useCallback((row: number, col: number): boolean => {
    const letter = letters.find(l => l.row === row && l.col === col)
    if (!letter || letter.char !== 'c') return false

    // Verificar si está precedida de 'a'
    const prevLetter = letters.find(l => l.row === row && l.col === col - 1)
    if (prevLetter && prevLetter.char === 'a') return true

    // Verificar si está seguida de 'e'
    const nextLetter = letters.find(l => l.row === row && l.col === col + 1)
    if (nextLetter && nextLetter.char === 'e') return true

    return false
  }, [letters])

  // Manejar clic en una letra
  const handleLetterClick = (row: number, col: number) => {
    if (!isRunning || isFinished) return

    setLetters(prevLetters => {
      const newLetters = [...prevLetters]
      const index = newLetters.findIndex(l => l.row === row && l.col === col)
      
      if (index === -1) return prevLetters

      const letter = newLetters[index]

      // Solo permitir seleccionar letras 'c'
      if (letter.char !== 'c') return prevLetters

      // Si ya está seleccionada, deseleccionarla
      if (letter.state === 'selected') {
        newLetters[index] = { ...letter, state: 'normal' }
        return newLetters
      }

      // Solo marcar como seleccionada, sin validar
      newLetters[index] = {
        ...letter,
        state: 'selected',
      }

      return newLetters
    })
  }

  // Iniciar el experimento
  const startExperiment = () => {
    setIsRunning(true)
    setTimeLeft(TIME_LIMIT)
    setIsFinished(false)
    setResults(null)
    // Resetear todas las letras
    setLetters(prevLetters => prevLetters.map(l => ({ ...l, state: 'normal' })))
  }

  // Finalizar experimento y calcular resultados
  const finishExperiment = useCallback(() => {
    setIsFinished(true)
    setIsRunning(false)

    setLetters((currentLetters: LetterData[]): LetterData[] => {
      // Validar todas las letras seleccionadas y marcarlas como correctas o incorrectas
      const updatedLetters: LetterData[] = currentLetters.map((letter: LetterData): LetterData => {
        if (letter.state === 'selected' && letter.char === 'c') {
          // Verificar si es correcta
          const prevLetter = currentLetters.find(l => l.row === letter.row && l.col === letter.col - 1)
          const nextLetter = currentLetters.find(l => l.row === letter.row && l.col === letter.col + 1)
          
          const isCorrect = (prevLetter && prevLetter.char === 'a') || (nextLetter && nextLetter.char === 'e')
          
          const newState: LetterState = isCorrect ? 'correct' : 'incorrect'
          
          return {
            ...letter,
            state: newState,
          }
        }
        return letter
      })

      const selected = updatedLetters.filter(l => l.state === 'correct' || l.state === 'incorrect')
      const correct = updatedLetters.filter(l => l.state === 'correct')
      const incorrect = updatedLetters.filter(l => l.state === 'incorrect')
      
      // Calcular las 'c' que deberían haberse seleccionado pero no se seleccionaron
      const shouldBeSelected = updatedLetters.filter(l => {
        if (l.char !== 'c') return false
        
        // Verificar si está precedida de 'a'
        const prevLetter = updatedLetters.find(le => le.row === l.row && le.col === l.col - 1)
        if (prevLetter && prevLetter.char === 'a') return true
        
        // Verificar si está seguida de 'e'
        const nextLetter = updatedLetters.find(le => le.row === l.row && le.col === l.col + 1)
        if (nextLetter && nextLetter.char === 'e') return true
        
        return false
      })
      const missed = shouldBeSelected.filter(l => l.state !== 'correct').length

      setResults({
        totalSelected: selected.length,
        correct: correct.length,
        incorrect: incorrect.length,
        missed: missed,
      })
      
      return updatedLetters
    })
  }, [])

  // Temporizador
  useEffect(() => {
    if (!isRunning || isFinished) return

    if (timeLeft <= 0) {
      finishExperiment()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          finishExperiment()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isRunning, timeLeft, isFinished, finishExperiment])

  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!isRunning && !isFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Experimento de Tachado de Letras
          </h1>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-lg font-semibold text-gray-800 mb-2">Instrucciones:</p>
            <p className="text-gray-700">{INSTRUCTION}</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
            <p className="text-gray-700">
              <strong>Tiempo disponible:</strong> 3 minutos
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Objetivo:</strong> Selecciona todas las letras "c" que cumplan con las condiciones indicadas.
            </p>
          </div>
          <button
            onClick={startExperiment}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
          >
            Comenzar Experimento
          </button>
        </div>
      </div>
    )
  }

  if (isFinished && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Experimento Finalizado
          </h1>
          <div className="space-y-4 mb-6">
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <p className="text-lg font-semibold text-gray-800">Correctas:</p>
              <p className="text-2xl font-bold text-green-600">{results.correct}</p>
            </div>
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-lg font-semibold text-gray-800">Incorrectas:</p>
              <p className="text-2xl font-bold text-red-600">{results.incorrect}</p>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-lg font-semibold text-gray-800">Omitidas:</p>
              <p className="text-2xl font-bold text-yellow-600">{results.missed}</p>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-lg font-semibold text-gray-800">Total seleccionadas:</p>
              <p className="text-2xl font-bold text-blue-600">{results.totalSelected}</p>
            </div>
            <div className="bg-gray-50 border-l-4 border-gray-400 p-4">
              <p className="text-lg font-semibold text-gray-800">Precisión:</p>
              <p className="text-2xl font-bold text-gray-600">
                {results.totalSelected > 0
                  ? ((results.correct / results.totalSelected) * 100).toFixed(1)
                  : 0}%
              </p>
            </div>
          </div>
          <button
            onClick={startExperiment}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-colors"
          >
            Reiniciar Experimento
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header con instrucciones y temporizador */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-4 sticky top-4 z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-600 mb-1">Instrucción:</p>
              <p className="text-sm text-gray-800">{INSTRUCTION}</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-600 mb-1">Tiempo restante:</p>
              <p className={`text-3xl font-bold ${timeLeft <= 30 ? 'text-red-600' : 'text-indigo-600'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
          </div>
        </div>

        {/* Grilla de letras */}
        <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
          <div className="inline-block">
            <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${LETTER_SEQUENCE[0]?.length || 40}, minmax(0, 1fr))` }}>
              {letters.map((letter, index) => {
                const getLetterStyle = () => {
                  const baseStyle = 'w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-xs sm:text-sm font-mono transition-all border border-gray-200'
                  
                  if (letter.char === 'c') {
                    switch (letter.state) {
                      case 'correct':
                        return `${baseStyle} bg-green-200 text-green-800 font-bold border-green-400 cursor-default`
                      case 'incorrect':
                        return `${baseStyle} bg-red-200 text-red-800 font-bold border-red-400 cursor-default`
                      case 'selected':
                        return `${baseStyle} bg-blue-200 text-blue-800 border-blue-400 cursor-pointer`
                      default:
                        return `${baseStyle} bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100`
                    }
                  }
                  
                  return `${baseStyle} bg-gray-50 text-gray-600 cursor-default`
                }

                return (
                  <div
                    key={`${letter.row}-${letter.col}`}
                    className={getLetterStyle()}
                    onClick={() => handleLetterClick(letter.row, letter.col)}
                    title={letter.char === 'c' ? 'Clic para seleccionar' : ''}
                  >
                    {letter.char}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Leyenda */}
        <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-200 border border-blue-400"></div>
              <span className="text-gray-700">C seleccionada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-green-200 border border-green-400"></div>
              <span className="text-gray-700">C correcta (al finalizar)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-red-200 border border-red-400"></div>
              <span className="text-gray-700">C incorrecta (al finalizar)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

