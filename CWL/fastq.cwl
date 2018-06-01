#!/usr/bin/env cwl-runner
cwlVersion: v1.0
class: CommandLineTool

hints:
  DockerRequirement:
    dockerPull: inutano/sra-toolkit

inputs:
  sraFile:
    type: File
    inputBinding:
      position: 1


baseCommand: [fastq-dump, --split-files, --skip-technical, --gzip]

outputs:
  fastq:
    type: stdout

stdout: $(inputs.out_fastq_prefix).fastq