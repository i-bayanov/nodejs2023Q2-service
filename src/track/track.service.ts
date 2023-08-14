import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTrackDto, UpdateTrackDto } from './dto';

import { Track } from './entities/track.entity';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(Track)
    private trackRepository: Repository<Track>,
  ) {}

  private async findTrack(id: string) {
    const track = await this.trackRepository.findOneBy({ id });
    if (!track) throw new NotFoundException('Track not found');

    return track;
  }

  create(createTrackDto: CreateTrackDto) {
    const createdTrack = this.trackRepository.create(createTrackDto);

    return this.trackRepository.save(createdTrack);
  }

  async findAll() {
    return (await this.trackRepository.find()).map((track) => track.toResponse());
  }

  async findOne(id: string) {
    return (await this.findTrack(id)).toResponse();
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const track = await this.findTrack(id);

    Object.assign(track, updateTrackDto);

    return this.trackRepository.save(track);
  }

  async remove(id: string) {
    const deleteResult = await this.trackRepository.delete(id);

    if (!deleteResult.affected) throw new NotFoundException('Track not found');
  }
}
