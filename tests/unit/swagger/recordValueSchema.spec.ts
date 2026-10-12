import { MetadataGenerator } from '@tsoa/cli/metadataGeneration/metadataGenerator';
import { SpecGenerator3 } from '@tsoa/cli/swagger/specGenerator3';
import { SpecGenerator31 } from '@tsoa/cli/swagger/specGenerator31';
import { expect } from 'chai';
import 'mocha';
import { getDefaultExtendedOptions } from '../../fixtures/defaultOptions';

describe('Record<string, V> resolved from a synthesized type node (inside Partial<>, with strictNullChecks)', () => {
  const metadata = new MetadataGenerator('./fixtures/controllers/recordValueController.ts', { strictNullChecks: true }).Generate();

  const specs = [
    { version: '3.0', spec: new SpecGenerator3(metadata, getDefaultExtendedOptions()).GetSpec() },
    { version: '3.1', spec: new SpecGenerator31(metadata, getDefaultExtendedOptions()).GetSpec() },
  ];

  specs.forEach(({ version, spec }) => {
    describe(`OpenAPI ${version}`, () => {
      const schemas = spec.components.schemas!;

      it('keeps the nullable value type of Record<string, string | null>', () => {
        const record = schemas['Record_string.string-or-null_'];

        expect(record.type).to.eq('object');
        expect(record.properties).to.deep.eq({});
        expect(record.additionalProperties).to.deep.eq({ type: 'string', nullable: true });
      });

      it('references the model value type of Record<string, Model>', () => {
        const record = schemas['Record_string.RecordValueModel_'];

        expect(record.type).to.eq('object');
        expect(record.properties).to.deep.eq({});
        expect(record.additionalProperties).to.deep.eq({ $ref: '#/components/schemas/RecordValueModel' });
        expect(schemas['RecordValueModel'].required).to.deep.eq(['label']);
        expect(schemas['RecordValueModel'].properties!.label.type).to.eq('string');
      });
    });
  });
});
