#!/usr/bin/env nextflow

species = [
  'Streptococcus pneumoniae': [
    'referenceURL': 'http://ftp.ncbi.nlm.nih.gov/genomes/all/GCF/000/007/045/GCF_000007045.1_ASM704v1/GCF_000007045.1_ASM704v1_genomic.fna.gz',
    'sraAccession': 'ERR045788'
  ]
]


BASE_PATH = System.getProperty('user.dir') + '/'
BIN = BASE_PATH + '../bin'
ADAPTERS = BASE_PATH + '../adapters'
TMPDIR = 'kmc-temp'

KMERSIZE = 20
PLOTXMAX = 60
PLOTYMAX = 1200000
MINCOVERAGE = 5

THREADS = 20
MEMORYGB = 4

echo true

// ==== Download ====

process downloadReference {
  container true

  input: val referenceURL from species.collect { it.value.referenceURL }
  output: file 'reference.genomic.fna.gz' into referenceGenomeGz

  """
  appropriate/curl $referenceURL -o reference.genomic.fna.gz
  """
}

referenceGenomeGz.into { referenceGenomeGz1;
                         referenceGenomeGz2;
                         referenceGenomeGz3;
                         referenceGenomeGz4 }


process downloadSRA {
  container 'bionode/bionode-ncbi'

  input: val sraAccession from species.collect { it.value.sraAccession }
  output: file '**/*.sra' into reads

  """
  bionode-ncbi download sra $sraAccession > tmp
  """
}

// === EXTRACT/DECOMPRESS ===

process fastaqDump {
	// container 'inutano/sra-toolkit'

	input: file read from reads
	output: file '*.fastq.gz' into samples

	"""
	fastq-dump --split-files --skip-technical --gzip $read
	"""

}

( samples1,
  samples2 ) = samples.into(2)


process gunzipit {
	//container 'bionode/bionode-watermill:dev'

	input: file referenceGenome from referenceGenomeGz1
	output: file 'reference.genomic.fna' into referenceGenomes

	"""
	gunzip -c $referenceGenome > reference.genomic.fna
	"""
}

( referenceGenomes1,
  referenceGenomes2 ) = referenceGenomes.into(2)

// // index using first bwa

process indexReferenceBwa {
	//container 

	input: file reference from referenceGenomeGz2
	output: file '*.gz.*' into referenceIndexes

	"""
	bwa index $reference -p bwa_index
	"""
}

( referenceIndexes1,
  referenceIndexes2 ) = referenceIndexes.into(2)


// Bowtie 2
 process indexReferenceBowtie2 {

 	input: file reference from referenceGenomeGz3
 	output: file '*.gz.*' into referenceIndexes

 	"""
 	bowtie2-build -q $reference $referenceIndexes
 	"""
 }

 //Mappers with bwa

 process bwaMapper {

 	input:
    	file reference from referenceGenomeGz3
    	file referenceIndex from referenceIndexes1
    	file sample from reads_kmc
  	output: file 'reads.sam' into readsUnsorted_kmc


  	"""
	bwa mem -t ${THREADS} bwa_index ${input.reference} ${input.sample} > $reads.sam
	"""
 }

 // with bowtie2

 process
