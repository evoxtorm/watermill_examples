#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool

requirements:
  - $import: fastq-docker.yml

inputs:
  sraFile:
    type: File
    inputBinding:
      position: 1


baseCommand: [fastq-dump, --split-files, --skip-technical, ., --gzip]
outputs:
  zippedFile:
    type: File
    outputBinding:
      glob: '*.zip'
  report:
    type: Directory
    outputBinding:
      glob: .