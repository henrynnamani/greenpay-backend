import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CarbonProject } from '../schema/projects.schema';
import { Model } from 'mongoose';
import * as SYS_MSG from '@/shared/system-message';
import { ConfigService } from '@nestjs/config';
import { gql, GraphQLClient } from 'graphql-request';

@Injectable()
export class ProjectService {
  private readonly endpoint;
  private readonly client;
  constructor(
    @InjectModel(CarbonProject.name)
    private readonly projectModel: Model<CarbonProject>,
    private readonly configService: ConfigService,
  ) {
    ((this.endpoint =
      'https://gateway-arbitrum.network.thegraph.com/api/f7a5ac8562fc51aa56a5d7a9a9dfec80/subgraphs/id/BWmN569zDopYXp3nzDukJsGDHqRstYAFULFPH8rxyVBk'),
      (this.client = new GraphQLClient(this.endpoint)));
  }

  async fetchCarbonProjects() {
    const query = gql`
      {
        tco2Tokens(first: 20) {
          id
          name
          symbol
          address
          projectVintage {
            name
            startTime
            endTime
            id
          }
        }
      }
    `;

    const data = await this.client.request(query);

    return data.tco2Tokens;
  }
}
