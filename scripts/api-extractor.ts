import {
  Extractor,
  ExtractorConfig,
  ExtractorResult,
  IExtractorInvokeOptions,
} from '@microsoft/api-extractor'
import * as path from 'path'

export function invoke(options?: IExtractorInvokeOptions) {
  const extractorConfig = ExtractorConfig.loadFileAndPrepare(
    path.join(process.cwd(), 'api-extractor.json')
  )

  const extractorResult: ExtractorResult = Extractor.invoke(
    extractorConfig,
    options
  )

  if (!extractorResult.succeeded) {
    throw new Error(
      `API Extractor completed with ${extractorResult.errorCount} errors and ${extractorResult.warningCount} warnings`
    )
  }
}
