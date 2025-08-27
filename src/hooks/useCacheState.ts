"use client";

import { useState, useCallback } from 'react';
import { cacheUtils } from '@/utils/cache';

interface CacheState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

interface UseCacheStateOptions<T> {
  cacheKey: string;
  cacheType: 'geocoding' | 'events' | 'attractions' | 'healthSecurity';
  fetchFunction: () => Promise<T>;
  skipCache?: boolean;
}

export function useCacheState<T>({ 
  cacheKey, 
  cacheType, 
  fetchFunction, 
  skipCache = false 
}: UseCacheStateOptions<T>) {
  const [state, setState] = useState<CacheState<T>>({
    data: null,
    isLoading: false,
    error: null,
    lastUpdated: null
  });

  const getCacheData = useCallback((): T | null => {
    if (skipCache) return null;
    
    switch (cacheType) {
      case 'geocoding':
        return cacheUtils.geocoding.get<T>(cacheKey);
      case 'events':
        return cacheUtils.events.get<T>(cacheKey);
      case 'attractions':
        return cacheUtils.attractions.get<T>(cacheKey);
      case 'healthSecurity':
        return cacheUtils.healthSecurity.get<T>(cacheKey);
      default:
        return null;
    }
  }, [cacheKey, cacheType, skipCache]);

  const setCacheData = useCallback((data: T) => {
    switch (cacheType) {
      case 'geocoding':
        cacheUtils.geocoding.set(cacheKey, data);
        break;
      case 'events':
        cacheUtils.events.set(cacheKey, data);
        break;
      case 'attractions':
        cacheUtils.attractions.set(cacheKey, data);
        break;
      case 'healthSecurity':
        cacheUtils.healthSecurity.set(cacheKey, data);
        break;
    }
  }, [cacheKey, cacheType]);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first (unless forcing refresh)
    if (!forceRefresh) {
      const cachedData = getCacheData();
      if (cachedData) {
        setState(prev => ({
          ...prev,
          data: cachedData,
          lastUpdated: Date.now()
        }));
        return cachedData;
      }
    }

    // Set loading state
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const data = await fetchFunction();
      
      // Cache the data
      setCacheData(data);
      
      // Update state
      setState(prev => ({
        ...prev,
        data,
        isLoading: false,
        lastUpdated: Date.now()
      }));

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      throw error;
    }
  }, [fetchFunction, getCacheData, setCacheData]);

  const refresh = useCallback(() => {
    return fetchData(true);
  }, [fetchData]);

  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null
    }));
  }, []);

  return {
    ...state,
    fetchData,
    refresh,
    clearError,
    hasCachedData: getCacheData() !== null
  };
}
