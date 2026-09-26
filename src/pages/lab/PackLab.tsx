/** #/lab — segnaposto: si riempie nella fase dedicata. */

import { Container, Section } from '../../components'
import { LabShell } from './LabShell'

export function PackLab() {
  return (
    <LabShell title="laboratorio pack" intro="In arrivo nella fase dedicata.">
      <Section tone="page"><Container><p className="text-body-md text-text-muted">In costruzione.</p></Container></Section>
    </LabShell>
  )
}

export default PackLab
