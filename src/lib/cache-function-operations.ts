// Function-level cache utilities with 'use cache'

import { createLogger } from '@/lib/logger';

const logger = createLogger({ prefix: 'FUNCTION-CACHE' });

interface FunctionCacheStats {
  functionName: string;
  hits: number;
  misses: number;
  executionTime: number;
  lastCalled: string;
}

const functionStats: Map<string, FunctionCacheStats> = new Map();

export function recordFunctionCall(
  functionName: string,
  executionTime: number,
  isHit: boolean
) {
  const existing = functionStats.get(functionName) || {
    functionName,
    hits: 0,
    misses: 0,
    executionTime: 0,
    lastCalled: new Date().toISOString(),
  };

  if (isHit) {
    existing.hits++;
  } else {
    existing.misses++;
  }

  existing.executionTime = executionTime;
  existing.lastCalled = new Date().toISOString();

  functionStats.set(functionName, existing);
}

export function getFunctionStats() {
  return Array.from(functionStats.values());
}

// Function 1: Heavy computation with 'use cache'
export async function calculateFibonacci(n: number) {
  logger.debug(`Computing Fibonacci(${n})...`);

  const startTime = performance.now();

  // Simulate heavy computation
  const fib = (num: number): number => {
    if (num <= 1) return num;
    return fib(num - 1) + fib(num - 2);
  };

  // Use a smaller number for demo to avoid long computation
  const result = fib(Math.min(n, 30));

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  recordFunctionCall('calculateFibonacci', executionTime, false);

  return {
    input: n,
    result,
    computedAt: new Date().toISOString(),
    executionMs: Math.round(executionTime),
  };
}

// Function 2: API simulation with cache
export async function fetchWeatherData(city: string) {
  logger.debug(`Fetching weather for ${city}...`);

  const startTime = performance.now();

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  recordFunctionCall('fetchWeatherData', executionTime, false);

  return {
    city,
    temperature: Math.floor(Math.random() * 30) + 5,
    condition: ['Sunny', 'Cloudy', 'Rainy', 'Snowy'][Math.floor(Math.random() * 4)],
    humidity: Math.floor(Math.random() * 100),
    fetchedAt: new Date().toISOString(),
    executionMs: Math.round(executionTime),
  };
}

// Function 3: Data transformation with cache
export async function processUserData(userId: string) {
  logger.debug(`Processing data for user ${userId}...`);

  const startTime = performance.now();

  // Simulate data processing
  await new Promise((resolve) => setTimeout(resolve, 300));

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  recordFunctionCall('processUserData', executionTime, false);

  return {
    userId,
    processedData: {
      totalTransactions: Math.floor(Math.random() * 100),
      accountAge: Math.floor(Math.random() * 10),
      averageSpending: Math.floor(Math.random() * 5000),
      riskScore: Math.random().toFixed(2),
    },
    processedAt: new Date().toISOString(),
    executionMs: Math.round(executionTime),
  };
}

