import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from './supabase'
import type { Entrega, Episodio, Fato } from './tipos'

async function ou<T>(p: PromiseLike<{ data: T | null; error: { message: string } | null }>): Promise<T> {
  const { data, error } = await p
  if (error) throw new Error(error.message)
  return data as T
}

export const useEpisodios = () =>
  useQuery({ queryKey: ['episodios'], queryFn: () => ou<Episodio[]>(supabase.from('episodios').select('*')) })

export const useFatos = (ids: string[]) =>
  useQuery({
    queryKey: ['fatos', ids],
    enabled: ids.length > 0,
    queryFn: () => ou<Fato[]>(supabase.from('fatos').select('*').in('id', ids)),
  })

/** Quantos fatos validados existem no banco (0 = o sync automático ainda não rodou). */
export const useTotalFatos = () =>
  useQuery({
    queryKey: ['fatos-total'],
    queryFn: async () => {
      const { count, error } = await supabase.from('fatos').select('id', { count: 'exact', head: true })
      if (error) throw new Error(error.message)
      return count ?? 0
    },
  })

export const useEntregas = (slug: string) =>
  useQuery({
    queryKey: ['entregas', slug],
    queryFn: () => ou<Entrega[]>(supabase.from('entregas').select('*').eq('slug', slug).order('criado_em', { ascending: false })),
  })

/** Mudou no banco (sync do repo, aviso do Slack)? Atualiza a tela sozinha. */
export function useAoVivo() {
  const qc = useQueryClient()
  useEffect(() => {
    const canal = supabase
      .channel('central')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'episodios' }, () => qc.invalidateQueries({ queryKey: ['episodios'] }))
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entregas' }, () => qc.invalidateQueries({ queryKey: ['entregas'] }))
      .subscribe()
    return () => { supabase.removeChannel(canal) }
  }, [qc])
}
