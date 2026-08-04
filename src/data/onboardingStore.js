const STORAGE_KEY = 'hrinsight_onboarding_plans_v1'

export function getOnboardingPlans() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persist(plans) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(plans))
  return plans
}

export function savePlans(newPlans) {
  const existing = getOnboardingPlans()
  const now = Date.now()
  const withIds = (newPlans || []).map((plan, i) => ({
    ...plan,
    id: plan.id || `plan-${now}-${i}`,
    createdAt: plan.createdAt || new Date().toISOString(),
    checkedTasks: plan.checkedTasks || {},
    signOffs: plan.signOffs || {},
  }))
  const merged = [...existing, ...withIds]
  return persist(merged)
}

export function togglePlanTask(planId, section, taskIndex) {
  const key = `${section}-${taskIndex}`
  const plans = getOnboardingPlans().map((p) => {
    if (p.id !== planId) return p
    const checkedTasks = { ...(p.checkedTasks || {}) }
    checkedTasks[key] = !checkedTasks[key]
    return { ...p, checkedTasks }
  })
  return persist(plans)
}

export function signOffSection(planId, sectionKey, { managerName, note } = {}) {
  const plans = getOnboardingPlans().map((p) => {
    if (p.id !== planId) return p
    const signOffs = { ...(p.signOffs || {}) }
    signOffs[sectionKey] = {
      managerName: (managerName || '').trim(),
      note: (note || '').trim() || null,
      signedAt: new Date().toISOString(),
    }
    return { ...p, signOffs }
  })
  return persist(plans)
}

export function clearSignOff(planId, sectionKey) {
  const plans = getOnboardingPlans().map((p) => {
    if (p.id !== planId) return p
    const signOffs = { ...(p.signOffs || {}) }
    delete signOffs[sectionKey]
    return { ...p, signOffs }
  })
  return persist(plans)
}
