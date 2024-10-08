import { atom } from 'jotai'
import { astAtom, groupNamesAtom, undoStack } from './atoms'
import type { AST } from '@/parser'
import { makeChoiceValid, visit } from '@/parser'
import { toast } from '@/components/ui/use-toast'

export const refreshGroupAtom = atom(null, (get, set, ast: AST.Regex) => {
  let groupIndex = 0
  const groupNames: string[] = []
  visit(ast, (node: AST.Node) => {
    if (
      node.type === 'group'
      && (node.kind === 'capturing' || node.kind === 'namedCapturing')
    ) {
      const index = ++groupIndex
      node.index = index
      if (node.kind === 'capturing') {
        node.name = index.toString()
        groupNames.push(index.toString())
      } else {
        groupNames.push(node.name)
      }
    }
  })
  set(groupNamesAtom, groupNames)
})

export const pushUndoAtom = atom(null, (get) => {
  undoStack.push(get(astAtom))
})

export const makeChoiceValidAtom = atom(null, (get, set, ast: AST.Regex) => {
  if (!makeChoiceValid(ast)) {
    toast({
      description: 'Group automatically',
    })
  }
})

export const refreshValidUndoAtom = atom(null, (get, set, ast: AST.Regex) => {
  set(refreshGroupAtom, ast)
  set(makeChoiceValidAtom, ast)
  set(pushUndoAtom)
})

export const validUndoAtom = atom(null, (get, set, ast: AST.Regex) => {
  set(makeChoiceValidAtom, ast)
  set(pushUndoAtom)
})
